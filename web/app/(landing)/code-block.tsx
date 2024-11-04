import type { Runtime } from "@/config/editor/types";

import { Button } from "@nextui-org/button";
import { CogIcon, CopyCheckIcon, CopyIcon, PlayCircleIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import MonacoEditor from "@/components/monaco-editor";
import CodeResponse from "@/config/editor/code-response";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import useCodeRunner from "@/hooks/useRunCode";
import { cn, languageSupportTransformMap, transformString } from "@/lib/utils";

export default function CodeBlock(runtime: Runtime) {
    const { languageName, snippet, filename } = runtime;
    const { isRunning, codeResponse, run, error } = useCodeRunner();
    const [content, setContent] = useState(snippet);
    const runningCtx = `Running ${filename}...`;
    const timeCtx = `Finished in ${codeResponse?.time}ms`;
    const { resolvedTheme } = useTheme();
    const { handleCopyToClipboard, isCopied } = useCopyToClipboard();

    const handleCodeRunner = async () => {
        await run({
            languageName,
            content,
            filename,
        });
    };

    return (
        <div className="relative w-full rounded-lg bg-background shadow-lg">
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex flex-row space-x-2">
                        <span className="size-3 rounded-full bg-red-500" />
                        <span className="size-3 rounded-full bg-yellow-500" />
                        <span className="size-3 rounded-full bg-green-500" />
                    </div>
                    <Button
                        isIconOnly
                        aria-label={isCopied ? "Copied" : "Copy to clipboard"}
                        color={resolvedTheme === "dark" ? "default" : "primary"}
                        size="sm"
                        startContent={
                            isCopied ? <CopyCheckIcon size={24} /> : <CopyIcon size={24} />
                        }
                        variant="light"
                        onPress={() => {
                            handleCopyToClipboard(content);
                        }}
                    />
                </div>
                <div className="flex h-[30dvh] flex-col">
                    <MonacoEditor
                        language={transformString({
                            str: languageName,
                            map: languageSupportTransformMap,
                            lowerCase: true,
                        })}
                        value={content}
                        onChange={(content) => {
                            if (!content) {
                                return;
                            }
                            setContent(content);
                        }}
                    />
                </div>
                <div className="text-xs">
                    {isRunning ? (
                        <CodeResponse
                            customStyle={{
                                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                            }}
                            response={runningCtx}
                        />
                    ) : codeResponse?.time ? (
                        <CodeResponse response={timeCtx} />
                    ) : null}
                    <div
                        className={cn("transition-opacity duration-500", {
                            "opacity-0": isRunning,
                            "opacity-100": !isRunning,
                        })}
                    >
                        {codeResponse?.stderr && <CodeResponse response={codeResponse.stderr} />}
                        {codeResponse?.stdout && <CodeResponse response={codeResponse.stdout} />}
                        {error && <CodeResponse response={error} />}
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <Button
                        className={cn("animate-pulse text-white hover:animate-none", {
                            "animate-none": isRunning,
                        })}
                        color="success"
                        endContent={<span>Run</span>}
                        isDisabled={isRunning}
                        isLoading={isRunning}
                        radius="sm"
                        size="md"
                        spinner={
                            <CogIcon
                                className={cn({
                                    "animate-spin": isRunning,
                                })}
                                size={16}
                            />
                        }
                        spinnerPlacement="end"
                        startContent={
                            <PlayCircleIcon className={cn({ hidden: isRunning })} size={16} />
                        }
                        onPress={handleCodeRunner}
                    />
                </div>
            </div>
        </div>
    );
}
