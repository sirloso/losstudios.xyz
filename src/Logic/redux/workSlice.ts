import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { WorkCMSSchema } from './api'
import { 
	AppDispatch,
	RootState
} from './store'

export interface Work extends WorkCMSSchema{ }

export interface WorkState{
	works: Array<Work>,
	currentWork?: Work
}

let initialState: WorkState = {
	works: []
}


const workSlice = createSlice({
	name: 'works',
	initialState,
	reducers: {
		addWorks: (state, action: PayloadAction<Work[]>) => {
			state.works = action.payload
		},
		chooseWork: (state,action: PayloadAction<Work>) => {
			state.currentWork = action.payload
		}
	}
})

export const { addWorks } = workSlice.actions

// export const selectWork = workSlice.

export default workSlice.reducer

export const selectCurrentWork = (state:RootState) => state.work.currentWork

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector