"use server";

import * as Sentry from "@sentry/nextjs";
import { cache } from "react";
import type { CodeResponse, Metadata } from "../redux/tab_slice";
import { RCEHandler } from "./rce_handler";
import { imageNameTransformMap, isNonEmptyString, transformString } from "./utils";

export default async function handleCodeExecution({
    languageName,
    content,
    filename,
}: {
    content: string;
    filename: string;
} & Metadata): Promise<CodeResponse & { time?: number }> {
    const lowerCaseLanguageName = languageName.toLowerCase();
    const image = getImage(lowerCaseLanguageName);
    const rceHandler = new RCEHandler();

    if (!isNonEmptyString(content)) {
        return {
            stdout: "",
            stderr: "",
            error: "",
        };
    }

    if (!image) {
        Sentry.captureMessage(`${image} not found`);

        return {
            stdout: "",
            stderr: "",
            error: "Something went wrong, please try again",
        };
    }

    try {
        const startTime = performance.now();
        const runResponse = await rceHandler.execute({
            image,
            payload: {
                language: lowerCaseLanguageName,
                files: [
                    {
                        name: filename,
                        content,
                    },
                ],
            },
        });

        const endTime = performance.now();

        const time = endTime - startTime;

        return {
            ...runResponse,
            time,
        };
    } catch (error) {
        Sentry.captureException(error, {
            tags: {
                language: languageName,
                filename: filename,
            },
        });

        return {
            stdout: "",
            stderr: "",
            error: "Something went wrong, please try again",
        };
    }
}

const getImage = cache((languageName: string) => {
    const toImageName = transformString({
        str: languageName,
        map: imageNameTransformMap,
        lowerCase: true,
    });

    return `toolkithub/${toImageName}:edge`;
});
