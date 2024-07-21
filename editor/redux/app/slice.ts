import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type IsOpenPayload = Partial<{
    modal: boolean
    sidebar: boolean
}>

const apps_slice = createSlice({
    name: 'app',
    initialState: {
        isOpen: {
            modal: false,
            sidebar: true,
        } as IsOpenPayload,
    },
    reducers: {
        onIsOpen: (state, action: PayloadAction<IsOpenPayload>) => {
            state.isOpen = {
                ...state.isOpen,
                ...action.payload,
            }
        },
    },
})

export const { onIsOpen } = apps_slice.actions

export default apps_slice
