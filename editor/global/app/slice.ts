import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type IsOpenPayload = Partial<{
	modal: boolean
	sidebar: boolean
}>

const appSlice = createSlice({
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

export default appSlice

export const { onIsOpen } = appSlice.actions
