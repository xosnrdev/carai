import type { TogglePayload } from "./index.types";

import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

const app_slice = createSlice({
    name: "app",
    initialState: {
        isOpen: {
            modal: false,
            userGuide: false,
        } as TogglePayload,
    },
    reducers: {
        onIsOpen: (state, action: PayloadAction<TogglePayload>) => {
            state.isOpen = {
                ...state.isOpen,
                ...action.payload,
            };
        },
    },
});

const { onIsOpen } = app_slice.actions;

export { onIsOpen, app_slice as default };
