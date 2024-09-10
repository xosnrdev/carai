import type { CodeEditorViewState } from '@/redux/tab/index.types'

function serializeViewState(
    state: CodeEditorViewState | null
): CodeEditorViewState {
    if (!state) {
        return {
            cursorState: [],
            viewState: {
                scrollLeft: 0,
                firstPosition: { lineNumber: 1, column: 1 },
                firstPositionDeltaTop: 0,
            },
            contributionsState: {},
        }
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
            scrollTop: state.viewState.scrollTop,
            scrollTopWithoutViewZones:
                state.viewState.scrollTopWithoutViewZones,
            scrollLeft: state.viewState.scrollLeft,
            firstPosition: {
                lineNumber: state.viewState.firstPosition.lineNumber,
                column: state.viewState.firstPosition.column,
            },
            firstPositionDeltaTop: state.viewState.firstPositionDeltaTop,
        },
        contributionsState: state.contributionsState,
    }
}

export default serializeViewState
