import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth"
import taskSlice from "../features/tasks"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        tasks: taskSlice
    }
})

export type IRootState = ReturnType<typeof store.getState>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;