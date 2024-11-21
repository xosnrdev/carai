import type { OnChange, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

import { useTheme } from "next-themes";
import { type HTMLAttributes, useCallback, useState } from "react";

import { Logo } from "@/src/components/icons";
import MonacoEditor from "@/src/components/monaco_editor";
import useTabContext from "@/src/hooks/useTabContext";
import { languageSupportTransformMap, transformString } from "@/src/lib/utils";
import type { CodeEditorViewState, ViewState } from "@/src/redux/tab_slice";

export default function Editor({
    className,
}: {
    className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
    const { updateTab, activeTab, codeResponse, resizeLayout, viewState, setViewState } =
        useTabContext();

    const { resolvedTheme } = useTheme();
    const [editorView, setEditorView] = useState<editor.IStandaloneCodeEditor | null>(null);

    const handleEditorChange: OnChange = useCallback(
        (content) => {
            if (editorView) {
                const editorState = editorView.saveViewState();

                if (editorState) {
                    const extendedEditorState = {
                        state: serializeViewState(editorState),
                        stateFields: {
                            codeResponse: codeResponse ?? { error: "", stderr: "", stdout: "" },
                            resizeLayout,
                        },
                    } satisfies ViewState;

                    updateTab({
                        id: activeTab.id,
                        content: content ?? "",
                        viewState: extendedEditorState,
                    });
                }
            }
        },
        [updateTab, editorView, codeResponse, resizeLayout, activeTab],
    );

    const handleEditorOnMount: OnMount = useCallback(
        (editor) => {
            const serializedState = serializeViewState(viewState.state);

            if (editor && viewState) {
                editor.restoreViewState(serializedState);
                editor.focus();
            }

            setEditorView(editor);

            return () => editor.dispose();
        },
        [viewState],
    );

    if (editorView) {
        setViewState({
            id: activeTab.id,
            isMounted: true,
        });
    }

    return (
        <MonacoEditor
            className={className ?? ""}
            language={transformString({
                str: activeTab.metadata.languageName,
                map: languageSupportTransformMap,
                lowerCase: true,
            })}
            loading={<Logo />}
            options={{
                wordWrap: "on",
                minimap: {
                    enabled: false,
                },
                fontSize: 16,
                tabSize: 2,
                fixedOverflowWidgets: true,
                fontFamily: "var(--font-jetbrains-mono)",
                bracketPairColorization: {
                    enabled: true,
                },
                cursorStyle: "block",
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                lineHeight: 24,
                padding: {
                    top: 12,
                },
            }}
            theme={resolvedTheme === "dark" ? "carai-dark" : "carai-light"}
            value={activeTab.content}
            onChange={handleEditorChange}
            onMount={handleEditorOnMount}
        />
    );
}

function serializeViewState(state: CodeEditorViewState | null): CodeEditorViewState {
    if (!state) {
        return {
            cursorState: [],
            viewState: {
                scrollLeft: 0,
                firstPosition: { lineNumber: 1, column: 1 },
                firstPositionDeltaTop: 0,
            },
            contributionsState: {},
        };
    }

    return {
        cursorState: state.cursorState.map((cursor) => ({
            inSelectionMode: cursor.inSelectionMode,
            selectionStart: {
                lineNumber: cursor.selectionStart.lineNumber,
                column: cursor.selectionStart.column,
            },
            position: {
                lineNumber: cursor.position.lineNumber,
                column: cursor.position.column,
            },
        })),
        viewState: {
            scrollTop: state.viewState.scrollTop ?? 0,
            scrollTopWithoutViewZones: state.viewState.scrollTopWithoutViewZones ?? 0,
            scrollLeft: state.viewState.scrollLeft,
            firstPosition: {
                lineNumber: state.viewState.firstPosition.lineNumber,
                column: state.viewState.firstPosition.column,
            },
            firstPositionDeltaTop: state.viewState.firstPositionDeltaTop,
        },
        contributionsState: state.contributionsState,
    };
}
