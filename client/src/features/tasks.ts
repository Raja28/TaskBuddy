import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { ADDTASK_API, DELETETASK_API, UPDATETASK_API } from "../utils/api";
import toast from "react-hot-toast";
import { Task } from "../models";
import { Todo } from "../models";


const Unauthorized: string = 'Unauthorized'
interface TasksDetails {
    title: string | null,
    description: string | null,
    status: string | null
    date: string | null
}

interface InitState {

    tasks?: Array<{}> | null,
    viewTaskAsList: boolean,
    category: string,
    listOrder: string,
    status: string;
    error: string | null;
}

export const addTask = createAsyncThunk('posts/addTask', async (task: TasksDetails, { rejectWithValue }) => {
    const toasId = toast.loading('Please wait')
    try {
        const token = localStorage.getItem('accessToken')
        const response = await axios.post(ADDTASK_API, task, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.success) {
            toast.dismiss(toasId)
            toast.success("Task added")
        }

        return response?.data?.data
    } catch (error) {
        let err;
        toast.dismiss(toasId)
        // toast.error('Failed to add task')
        if (error instanceof AxiosError) {
            err = error?.response?.data?.message
            // return rejectWithValue(error?.response?.data?.message)
        }
        toast.error(err)
        return rejectWithValue(err)
    }
})

export const updateTask = createAsyncThunk('posts/updateTask', async (task: Task, { rejectWithValue }) => {
    const toasId = toast.loading('Please wait...')
    try {
        const response = await axios.post(UPDATETASK_API, task, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })

        if (response.data.success) {
            toast.dismiss(toasId);
            toast.success('Task updated successfully')
        }


        return response?.data?.task
    } catch (error) {
        toast.dismiss(toasId);
        let err;
        if (error instanceof AxiosError) {
            err = error?.response?.data?.message
        }
        toast.error(err)
        return rejectWithValue(err)
    }
})

export const deleteTask = createAsyncThunk('posts/deleteTask', async (taskId: string, { rejectWithValue }) => {
    const toastId = toast.loading('Please wait...')
    // console.log(taskId);

    try {
        const response = await axios.post(DELETETASK_API, { taskId }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success('Task deleted successfully')
        }
        return response?.data?.deletedTask
    } catch (error) {
        toast.dismiss(toastId);
        let err;
        if (error instanceof AxiosError) {
            err = error?.response?.data?.message
            toast.success(err)
            return rejectWithValue(err)
        }
    }
})

const initialState: InitState = {
    tasks: localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')!) : null,
    viewTaskAsList: true,
    category: 'all',
    listOrder: 'ascending',
    status: 'idle',
    error: null
}

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTask: (state) => {
            state.tasks = JSON.parse(localStorage.getItem('tasks')!)
        },
        setView: (state) => {
            state.viewTaskAsList = !state.viewTaskAsList
        },

        setCategory: (state, { payload }) => {
            console.log(payload);
            
            state.category = payload
        },
        setListOrder: (state, { payload }) => {
            state.listOrder = payload
        },

        setSort: (state) => {
            console.log("Sorting");

            const acd: string = 'ascending'
            // const defaultValue: string = 'default'
            const categoryAll = 'all'
            const categoryWork: string = 'work'
            const categoryPersonal: string = 'personal'
            state.tasks = JSON.parse(localStorage.getItem('tasks')!)

            if (state.category == categoryAll) {

                if (state.listOrder === acd) {
                    state.tasks?.sort((task1, task2) => new Date((task1?.createdAt)) - new Date(task2?.createdAt))
                    // console.log(current(state.tasks));

                } else {
                    state.tasks?.sort((task1, task2) => new Date(task2?.createdAt) - new Date(task1?.createdAt))
                    // console.log(current(state.tasks));
                }

            } else if (state.category === categoryWork) {
                let temp = state.tasks?.filter(task => task.category === categoryWork)
                // console.log(temp);

                if (state.listOrder === acd) {
                    temp?.sort((task1, task2) => new Date(task1?.createdAt) - new Date(task2?.createdAt))
                    // state.tasks = temp
                    // console.log(current());
                } else {
                    temp?.sort((task1, task2) => new Date(task2?.createdAt) - new Date(task1?.createdAt))
                }
                state.tasks = temp

            } else {
                let temp = state.tasks?.filter(task => task.category === categoryPersonal)
                if (state.listOrder === acd) {
                    temp?.sort((task1, task2) => new Date(task1?.createdAt) - new Date(task2?.createdAt))
                    state.tasks = temp
                    // console.log(current());

                } else {
                    temp?.sort((task1, task2) => new Date(task2?.createdAt) - new Date(task1?.createdAt))
                    state.tasks = temp

                }

            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(addTask.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(addTask.fulfilled, (state, { payload }) => {
                //  Array<{}> 
                let tasks = JSON.parse(localStorage.getItem('tasks')!)
                tasks = tasks?.length > 0 ? [...tasks, payload] : [payload]

                state.status = 'success'
                state.tasks = tasks
                localStorage.setItem('tasks', JSON.stringify(tasks))
            })
            .addCase(addTask.rejected, (state, { payload }) => {
                if (Unauthorized === payload) {
                    localStorage.clear()
                }
                state.status = 'error'
                state.error = JSON.stringify(payload)
            })

            .addCase(updateTask.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(updateTask.fulfilled, (state, { payload }) => {
                let tasks: Array<Todo> = JSON.parse(localStorage.getItem('tasks')!)
                // console.log(payload);

                const index = tasks.findIndex(task => task?._id === payload?._id)


                tasks.splice(index, 1);
                tasks = tasks.length > 0 ? [...tasks, payload] : [payload]
                localStorage.setItem('tasks', JSON.stringify(tasks))
                state.tasks = tasks
                state.status = 'success'

            })
            .addCase(updateTask.rejected, (state, { payload }) => {
                if (Unauthorized === payload) {
                    localStorage.clear()
                    window.location.href = '/'
                }
                state.status = 'error'
                state.error = JSON.stringify(payload)
            })
            .addCase(deleteTask.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(deleteTask.fulfilled, (state, { payload }) => {
                let tasks: Array<Todo> = JSON.parse(localStorage.getItem('tasks')!)

                const index = tasks.findIndex(task => task?._id === payload?._id)
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks))
                state.tasks = tasks
                state.status = 'success'
            })
            .addCase(deleteTask.rejected, (state, { payload }) => {
                if (Unauthorized === payload) {
                    localStorage.clear()
                    window.location.href = '/'
                }
                state.status = 'error'
                state.error = JSON.stringify(payload)
            })
    }
})


export const { setTask, setView, setSort, setCategory, setListOrder } = taskSlice.actions
export default taskSlice.reducer
