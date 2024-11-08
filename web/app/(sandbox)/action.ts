"use server";

import type { Metadata } from "@/redux/tab/index.types";
import type { CodeResponse } from "./types";

import * as Sentry from "@sentry/nextjs";

import { isNonEmptyString } from "@/lib/utils";

import { RCEHandler, getImage } from "./core";

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
