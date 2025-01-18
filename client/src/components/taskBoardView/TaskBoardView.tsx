import { RootState } from "@reduxjs/toolkit/query"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Todo } from "../../models"
import { deleteTask, updateTask } from "../../features/tasks"
import toast from "react-hot-toast"
import { AppDispatch } from "../../app/store"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
const formCheckPoint = 993

export const BoardView: React.FC = () => {
    const { width } = useWindowDimensions()
    const { tasks, status } = useSelector((state: RootState) => state.tasks)
    const [todoTasks, setTodoTasks] = useState<Todo[]>([])
    const [inProgessTasks, setInProgressTasks] = useState<Todo[]>([])
    const [completedTasks, setCompletedTasks] = useState<Todo[]>([])
    const [selectedTask, setSelectedTask] = useState<Todo>({
        category: '',
        description: '',
        dueDate: '',
        owner: '',
        status: '',
        title: '',
    })

    const [taskCreatedTime, setTaskCreatedTime] = useState<string>('')
    const [taskUpdatedTime, setTaskUpdatedTime] = useState<string>('')

    const dispatch = useDispatch<AppDispatch>()


    useEffect(() => {
        const todo: string = 'todo'
        const inprogress: string = 'in-progress'
        // const completed: string = 'completed'
        setTodoTasks([])
        setInProgressTasks([])
        setCompletedTasks([])

        tasks?.forEach(task => {
            if (task?.status === todo) {
                setTodoTasks(prev => [...prev, task])
            } else if (task?.status === inprogress) {
                setInProgressTasks(prev => [...prev, task])
            } else {
                setCompletedTasks(prev => [...prev, task])
            }
        })

        if (status === 'success') {
            const index = tasks?.findIndex(task => task?._id === selectedTask?._id)
            setSelectedTask(tasks[index])
        }


    }, [tasks, status])

    useEffect(() => {

        if (selectedTask != undefined) {
            const { createdAt, updatedAt } = selectedTask

            if (createdAt) {
                const createdDate: Date = new Date(createdAt)
                setTaskCreatedTime(`${createdDate.toDateString().split(' ').splice(1, 2).join(' ')} at ${createdDate.toLocaleTimeString().split(':').splice(0, 2).join(":")} ${createdDate.toLocaleTimeString().split(" ")[1]}`)
                const updatedDate: Date = new Date(updatedAt)
                setTaskUpdatedTime(`${updatedDate.toDateString().split(' ').splice(1, 2).join(' ')} at ${updatedDate.toLocaleTimeString().split(':').splice(0, 2).join(":")} ${updatedDate.toLocaleTimeString().split(" ")[1]}`);
            }

        }

    }, [selectedTask])

    function updateHandler(e: React.FormEvent) {
        e.preventDefault()
        const { category, description, dueDate, owner, status, title } = selectedTask
        const idx: number | undefined = tasks?.findIndex(task => task?._id === selectedTask._id)

        if (tasks[idx]?.title === title && tasks[idx]?.category === category && tasks[idx]?.description === description
            && tasks[idx]?.dueDate === dueDate && tasks[idx]?.status === status) {
            toast.error('No changes so far...')
            return
        }

        dispatch(updateTask(selectedTask))

    }

    function deleteHandler(taskId: string) {
        if (!taskId) {
            toast.error('Task Id required')
            return
        }
        dispatch(deleteTask(taskId))

        setSelectedTask({
            category: '',
            description: '',
            dueDate: '',
            owner: '',
            status: '',
            title: '',
        })
    }

    return (

        <>
            <main className="container">
                <div className="d-flex  flex-wrap flex-lg-nowrap flex-md-nowrap gap-3">

                    <div className="card vh-100 w-100 mb-4">
                        <div className="card-header">
                            <span className="p-2 bg-info rounded">TODO</span>
                        </div>
                        <div className="card-body">
                            {
                                todoTasks?.length > 0 ? (
                                    todoTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            data-bs-toggle="modal"
                                            data-bs-target="#updateModal"
                                            data-bs-whatever="@mdo"
                                            onClick={() => setSelectedTask(task)}
                                            className="d-flex flex-column justify-content-between card my-2 p-2" style={{ cursor: 'pointer' }}>

                                            <div className=" d-flex align-items-center gap-1 ">
                                                <div className=" fw-semibold fs-6">{task.title}</div>
                                            </div>
                                            <div className="d-flex w-100 justify-content-between py-1">
                                                <small className="w-100" >{task.dueDate}</small>
                                                {/* <div className="w-100 ">{task.status.toUpperCase()}</div> */}
                                                <small className="w-100 text-end">{task.category}</small>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No task Todo</p>
                                )
                            }

                        </div>
                    </div>
                    <div className="card vh-100 w-100 mb-4" >
                        <div className="card-header">
                            <span className="p-2 bg-warning rounded">IN-PROGRESS</span>
                        </div>
                        <div className="card-body bg-light">
                            {
                                inProgessTasks?.length > 0 ? (
                                    inProgessTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            data-bs-toggle="modal"
                                            data-bs-target="#updateModal"
                                            data-bs-whatever="@mdo"
                                            onClick={() => setSelectedTask(task)}
                                            className="d-flex flex-column justify-content-between card my-2 p-2" style={{ cursor: 'pointer' }}>

                                            <div className=" d-flex align-items-center gap-1 ">
                                                <div className=" fw-semibold fs-6">{task.title}</div>
                                            </div>
                                            <div className="d-flex w-100 justify-content-between py-1">
                                                <small className="w-100" >{task.dueDate}</small>
                                                {/* <div className="w-100 ">{task.status.toUpperCase()}</div> */}
                                                <small className="w-100 text-end">{task.category}</small>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No task In-Progress</p>
                                )
                            }

                        </div>
                    </div>
                    <div className="card vh-100 w-100 mb-4">
                        <div className="card-header">
                            <span className="p-2 bg-success rounded">COMPLETED</span>
                        </div>
                        <div className="card-body bg-light">

                            {
                                completedTasks?.length > 0 ? (
                                    completedTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            data-bs-toggle="modal"
                                            data-bs-target="#updateModal"
                                            data-bs-whatever="@mdo"
                                            onClick={() => setSelectedTask(task)}
                                            className="d-flex flex-column justify-content-between card my-2 p-2" style={{ cursor: 'pointer' }}>

                                            <div className=" d-flex align-items-center gap-1 ">
                                                <div className="text-decoration-line-through fw-semibold fs-6">{task.title}</div>
                                            </div>
                                            <div className="d-flex w-100 justify-content-between py-1">
                                                <small className="w-100" >{task.dueDate}</small>
                                                {/* <div className="w-100 ">{task.status.toUpperCase()}</div> */}
                                                <small className="w-100 text-end">{task.category}</small>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">No task in Compelted</p>
                                )
                            }

                        </div>
                    </div>
                    {/* MODALS */}
                    {/* Add task modal */}
                    <div className="modal fade" id="updateModal" aria-labelledby="exampleModalLabel" >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ color: "#7B1984", }} >Update Task</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex gap-2 ">
                                    <form className=" w-100">
                                        <div className="mb-3">
                                            <label htmlFor="recipient-name" className="col-form-label">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="recipient-name"
                                                name="title"
                                                placeholder="Enter Title"
                                                value={selectedTask?.title}
                                                disabled={status == "loading" ? true : false}
                                                onChange={(e) => setSelectedTask(prev => ({ ...prev, ['title']: e.target.value }))}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="message-text" className="col-form-label">Description</label>
                                            <textarea

                                                placeholder="Description"
                                                className="form-control"
                                                name='description'
                                                value={selectedTask?.description}
                                                onChange={(e) => setSelectedTask(prev => ({ ...prev, ['description']: e.target.value }))}
                                                disabled={status == "loading" ? true : false}
                                                id="message-text"></textarea>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <label>Task Category:</label>
                                                <div className="d-flex gap-1 ">
                                                    <div

                                                        onClick={() => setSelectedTask(prev => ({ ...prev, ['category']: 'work' }))}
                                                        className={`rounded-pill border px-2 my-auto mt-1 
                                                        //   ${selectedTask?.category === 'work' ? 'bg-warning' : ""}`}

                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        Work
                                                    </div>
                                                    <div
                                                        onClick={() => setSelectedTask(prev => ({ ...prev, ['category']: 'personal' }))}
                                                        className={`rounded-pill border px-2 my-auto mt-1
                                                        // ${selectedTask?.category === 'personal' ? 'bg-warning' : ""}`}
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
                                                        className="form-control"
                                                        placeholder="DD/MM/YYY"
                                                        id="dueDate"
                                                        disabled={status == 'loading' ? true : false}
                                                        value={selectedTask?.dueDate}
                                                        onChange={(e) => setSelectedTask(prev => ({ ...prev, ['dueDate']: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Status <sup>*</sup></label>
                                                    <select
                                                        onChange={(e) => setSelectedTask(prev => ({ ...prev, ['status']: e.target.value }))}
                                                        className="form-select"
                                                        defaultValue={selectedTask?.status}
                                                        disabled={status == 'loading' ? true : false}
                                                        aria-label="Default select example">
                                                        <option value={selectedTask?.status} className="text-secondary" >{selectedTask?.status}</option>
                                                        <option value="todo">To-Do</option>
                                                        <option value="in-progress">In-Progress</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {
                                        width >= formCheckPoint && <div className="w-50 border-start px-1">
                                            <div>
                                                <p className="fs-5 text-secondary border-bottom">Activity</p>
                                                <div className="text-secondary " style={{ fontSize: "15px" }}>
                                                    <p className="d-flex gap-3 justify-content-between">
                                                        <small className="">You created this task</small>
                                                        {/* <small>Dec 27 at 1:23</small> */}
                                                        <small>{taskCreatedTime}</small>
                                                    </p>
                                                    <p className="d-flex gap-2 justify-content-between">
                                                        <small className="">You updated this task</small>
                                                        <small className=" ">{taskUpdatedTime}</small>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="modal-footer d-flex justify-content-between bg-light">
                                    <div>
                                        <button
                                            onClick={() => deleteHandler(selectedTask?._id)}
                                            className="btn btn-danger rounded-pill"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            // disabled={status == "loading" ? true : false}
                                            type="button"
                                            className="btn btn-secondary rounded-pill"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            // onClick={""}
                                            // disabled={status == "loading" ? true : false}
                                            type="button"
                                            className="btn btn-primary rounded-pill"
                                            style={{ backgroundColor: "#7B1984", }}
                                            onClick={(e) => updateHandler(e)}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}