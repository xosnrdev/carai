import type { Limit, MaxContentDelimiter, Units } from "./index.types";

import { CustomError } from "@/lib/error";

export { getByteLength, isContentLimited, sliceContent };

const getByteLength = (content: string): number => {
    return new TextEncoder().encode(content).byteLength;
};

const sliceBytes = (content: string, limit: number): string => {
    return new TextDecoder().decode(new TextEncoder().encode(content).slice(0, limit));
};

const isContentLimited = (content: string, maxContentDelimiter: MaxContentDelimiter): boolean => {
    const { limit, units } = maxContentDelimiter;

    switch (units) {
        case "characters":
            return content.length > limit;
        case "bytes":
            return getByteLength(content) > limit;
        case "lines":
            return content.split("\n").length > limit;
        default:
            throw new CustomError(`Unsupported unit: ${units}`);
    }
};

const sliceContent = ({
    content,
    limit,
    units,
}: {
    content: string;
    limit: Limit;
    units: Units;
}): string => {
    switch (units) {
        case "characters":
            return content.slice(0, limit);
        case "bytes":
            return sliceBytes(content, limit);
        case "lines":
            return content.split("\n").slice(0, limit).join("\n");
        default:
            throw new CustomError(`Unsupported unit: ${units}`);
    }
};
