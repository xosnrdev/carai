import { isNonEmptyString } from "@/lib/utils";

function getContentLengthByLine(content: string) {
    return isNonEmptyString(content) ? content.trim().split("\n").length : 0;
}

export default getContentLengthByLine;
