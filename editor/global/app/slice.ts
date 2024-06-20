import type { CodeResponse } from '@/lib/types/response'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const appSlice = createSlice({
	name: 'app',
	initialState: {
		resizePanelVisible: true,
		codeResponse: null as CodeResponse | null,
	},
	reducers: {
		onResizePanelVisible: (state, action: PayloadAction<boolean>) => {
			state.resizePanelVisible = action.payload
		},
		onCodeResponse: (state, action: PayloadAction<CodeResponse | null>) => {
			state.codeResponse = action.payload
		},
	},
})

export default appSlice

export const { onResizePanelVisible, onCodeResponse } = appSlice.actions
