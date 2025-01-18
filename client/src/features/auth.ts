import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";
import { SIGNUP_API } from "../utils/api";
import toast from "react-hot-toast";

// <string[], void, { rejectValue: string }>
export const signupUser = createAsyncThunk('posts/signupUser', async (token: string, { rejectWithValue }) => {
    try {

        const response = await axios.get(SIGNUP_API, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response?.data
    } catch (error: unknown) {

        if (error instanceof AxiosError) {
            toast.error(error?.response?.data?.message)
            console.log(error?.response?.data?.message);
            return rejectWithValue(error?.response?.data?.message)
        }
        // return rejectWithValue(errMessage)
    }
})

type User = {
    _id?: string,
    name?: string,
    email?: string,
    createdAt?: string,
    uid?: string,
    picture?: string,
}

interface InitState {

    accessToken?: string | null
    user?: User | undefined,

    status: string;
    error: string | null;
}

const initialState: InitState = {
    accessToken: localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : null,
    // user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : undefined,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    status: 'idle',
    error: null
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setStatus: (state, { payload }) => {
            state.status = payload
        },

        setLogout: (state) => {
            localStorage.clear()
            state.accessToken = null
            state.user = undefined
            state.status = 'idle'
            state.error = null
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(signupUser.fulfilled, (state, { payload }) => {
                // console.log(payload);

                state.status = 'success'
                state.accessToken = payload?.accessToken
                localStorage.setItem("accessToken", payload?.accessToken)
                localStorage.setItem("user", JSON.stringify(payload?.user))
                localStorage.setItem('tasks', JSON.stringify(payload.user.tasks))
                state.user = JSON.parse(JSON.stringify(payload?.user))
            })

            .addCase(signupUser.rejected, (state, action) => {

                state.status = 'error';
                state.error = action.payload as string || 'Something went wrong';
            });
    }
})

export const { setStatus, setLogout } = authSlice.actions

export default authSlice.reducer