import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TogglePayload = Partial<{
    modal: boolean;
    actionModal: boolean;
}>;

export const appSlice = createSlice({
    name: "app",
    initialState: {
        isOpen: {
            modal: false,
            actionModal: false,
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

export const { onIsOpen } = appSlice.actions;
