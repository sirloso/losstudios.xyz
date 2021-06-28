import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { workApi } from './api'
import workReducer from './workSlice'

export const store = configureStore({
	reducer: {
		work: workReducer,
		[workApi.reducerPath]: workApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
		.concat(workApi.middleware)
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch