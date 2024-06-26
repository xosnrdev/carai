import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const appSlice = createSlice({
	name: 'app',
	initialState: {
		isOpen: false,
	},
	reducers: {
		onIsOpen: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload
		},
	},
})

export default appSlice

export const { onIsOpen } = appSlice.actions
