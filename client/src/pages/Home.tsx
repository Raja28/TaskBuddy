import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import React, { useEffect, useState } from "react";
import { setStatus } from "../features/auth";
import { ListView } from "../components/taskList/ListView";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { addTask, setCategory, setListOrder, setSort, setTask } from "../features/tasks";
import toast from "react-hot-toast";
import { BoardView } from "../components/taskBoardView/TaskBoardView";
// import { Header } from "../components/common/Header";

const screenMinWidth: number = 768

interface Task {
    title: string,
    description: string,
    category: string,
    date: string,
    status: string

}

export const Home: React.FC = () => {

    const { height, width } = useWindowDimensions()
    const { user, status } = useSelector((state: RootState) => state.auth)
    const { viewTaskAsList, listOrder, category } = useSelector((state: RootState) => state.tasks)
    const [sortTask, setSortTask] = useState<string>()
    const [newTask, setNewTask] = useState<Task>({
        title: "",
        description: "",
        category: "",
        date: "",
        status: ""
    })

    const dispatch = useDispatch<AppDispatch>()
    // console.log(height);

    useEffect(() => {
        dispatch(setStatus('idle'))
        dispatch(setTask())
    }, [])

    useEffect(()=>{
        dispatch(setSort())
    },[listOrder, category])

    const addTaskHandler = (e: React.FormEvent) => {
        e.preventDefault()
        // console.log(newTask);
        const { title, description, category, date, status } = newTask

        if (!title || !description || !category || !date || !status) {
            toast.error("All feilds required")
            return
        }

        dispatch(addTask(newTask))

        setNewTask({
            title: "",
            description: "",
            category: "",
            date: "",
            status: ""
        })
    }

    return (
        <>
            <section className="container mt-3">
                <div className=" d-flex justify-content-between">
                    <div className="d-flex align-items-center flex-wrap">
                        <div className="mx-1">Filter: </div>
                        <div className="d-flex gap-1">
                            <select 
                            onChange={(e)=> dispatch(setCategory(e.target.value))}
                            className="form-select form-select-sm rounded-pill " aria-label="Small select example" 
                            style={{ width: "6.7rem" }}>
                                <option className="text-secondary" value={"all"}>Category</option>
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                            </select>
                            <select 
                            onChange={(e)=> dispatch(setListOrder(e.target.value))}
                            className="form-select form-select-sm rounded-pill" 
                            aria-label="Small select example" style={{ width: "6.7rem" }}>
                                <option className="text-secondary" value={'default'}>Due Date</option>
                                <option value="ascending">Ascending</option>
                                <option value="decending">Decending</option>
                            </select>
                        </div>
                    </div>

                    <div className="" style={{ minWidth: "5rem" }}>
                        <button
                            className="btn btn-sm text-light rounded-pill"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            data-bs-whatever="@mdo"
                            style={{ backgroundColor: "#7B1984" }}>
                            Add Task
                        </button>
                    </div>
                </div>

                <hr />
            </section>
            <section>
                {
                    width >= screenMinWidth ? (
                        viewTaskAsList ? (<ListView sortTask={sortTask} />) : (<BoardView />)
                    ) : (<BoardView />)
                }
            </section>
            {/* <div>Welcome to Home Page</div> */}

            {/* MODALS */}
            {/* Add task modal */}
            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ color: "#7B1984", }} >Create Task</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="recipient-name" className="col-form-label">Title</label>
                                    <input
                                        type="text"
                                        required={true}
                                        className="form-control"
                                        id="recipient-name"
                                        name="title"
                                        placeholder="Enter Title"
                                        value={newTask.title}
                                        disabled={status == "loading" ? true : false}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, ['title']: e.target.value }))}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message-text" className="col-form-label">Description</label>
                                    <textarea

                                        placeholder="Description"
                                        className="form-control"
                                        name='description'
                                        value={newTask.description}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, ['description']: e.target.value }))}
                                        disabled={status == "loading" ? true : false}
                                        required={true}
                                        id="message-text"></textarea>
                                </div>

                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <label>Task Category:</label>
                                        <div className="d-flex gap-1 ">
                                            <div
                                                onClick={() => setNewTask(prev => ({ ...prev, ['category']: "work" }))}
                                                className={`rounded-pill border px-2 my-auto mt-1 
                                                     ${newTask.category === 'work' ? 'bg-warning' : ""}`}

                                                style={{ cursor: 'pointer' }}
                                            >
                                                Work
                                            </div>
                                            <div
                                                onClick={() => setNewTask(prev => ({ ...prev, ['category']: "personal" }))}
                                                className={`rounded-pill border px-2 my-auto mt-1
                                                ${newTask.category === 'personal' ? 'bg-warning' : ""}`}
                                                style={{ cursor: 'pointer' }}

                                            >
                                                Personal
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 align-items-center">
                                        <div className="d-flex flex-column">
                                            <label htmlFor="dueDate">Due on <sup>*</sup></label>
                                            <input
                                                type="date"
                                                required={true}
                                                className="form-control"
                                                placeholder="DD/MM/YYY"
                                                disabled={status == 'loading' ? true : false}
                                                value={newTask.date}
                                                name="dueDate"
                                                onChange={(e) => setNewTask(prev => ({ ...prev, ['date']: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">Status <sup>*</sup></label>
                                            <select
                                                onChange={(e) => setNewTask(prev => ({ ...prev, ['status']: e.target.value }))}
                                                className="form-select"
                                                required={true}
                                                disabled={status == 'loading' ? true : false}
                                                aria-label="Default select example">
                                                <option value={""} className="text-secondary" >Status</option>
                                                <option value="todo">To-Do</option>
                                                <option value="inProgress">In-Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                // disabled={status == "loading" ? true : false}
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addTaskHandler}
                                // disabled={status == "loading" ? true : false}
                                type="button"
                                className="btn btn-primary">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}