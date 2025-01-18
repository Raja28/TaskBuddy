import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../app/store"
import { useEffect, useState } from "react"
import {  Todo } from "../../models"
import { PiDotsSixVerticalLight } from "react-icons/pi";


import { BsCheckCircle } from "react-icons/bs";
import { BsCheckCircleFill } from "react-icons/bs";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import toast from "react-hot-toast";
import { deleteTask, updateTask } from "../../features/tasks";


const formCheckPoint = 993

export const ListView: React.FC = ({ sortTask }) => {
    const { width } = useWindowDimensions()

    const { tasks, status } = useSelector((state: RootState) => state.tasks)
    const [todoTasks, setTodoTasks] = useState<Todo[]>([])
    const [inProgessTasks, setInProgressTasks] = useState<Todo[]>([])
    const [todoCompleted, setCompletedTasks] = useState<Todo[]>([])

    const [taskCreatedTime, setTaskCreatedTime] = useState<string>('')
    const [taskUpdatedTime, setTaskUpdatedTime] = useState<string>('')

    // const [selectedTaskId, setSelectedTaskId] = useState<number>()
    const [selectedTask, setSelectedTask] = useState<Todo>({
        category: '',
        description: '',
        dueDate: '',
        owner: '',
        status: '',
        title: '',
    })

    const dispatch = useDispatch<AppDispatch>()
    // const [updateTask, setSelectedTas] = useState<string>('')

    // useEffect(() => {
    //     // Initialize Bootstrap popover after the component is mounted
    //     const popoverTriggerList = Array.from(
    //         document.querySelectorAll('[data-bs-toggle="popover"]')
    //     );
    //     popoverTriggerList.map((popoverTriggerEl) => new Popover(popoverTriggerEl));
    // }, []);

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
        // console.log(selectedTask);

        if (selectedTask != undefined) {
            const { createdAt, updatedAt } = selectedTask

            if (createdAt) {
                const createdDate: Date = new Date(createdAt)
                setTaskCreatedTime(`${createdDate.toDateString().split(' ').splice(1, 2).join(' ')} at ${createdDate.toLocaleTimeString().split(':').splice(0, 2).join(":")} ${createdDate.toLocaleTimeString().split(" ")[1]}`)
                const updatedDate: Date = new Date(String(updatedAt))
                setTaskUpdatedTime(`${updatedDate.toDateString().split(' ').splice(1, 2).join(' ')} at ${updatedDate.toLocaleTimeString().split(':').splice(0, 2).join(":")} ${updatedDate.toLocaleTimeString().split(" ")[1]}`);
            }

        }
    }, [selectedTask])

    // useEffect(() => {
    //     console.log(sortTask);
        
    //     let temp = tasks
    //     if (sortTask == 'decending') {

    //         // setCompletedTasks(prev => prev.sort((task1, task2) => task2.dueDate - task1.dueDate))
    //         temp?.sort((task1, task2)=> task2.dueDate - task1.dueDate)
    //         console.log(temp);
    //     } else {
    //         // setCompletedTasks(prev => prev.sort((task1, task2) => task1.dueDate - task2.dueDate))
    //         temp?.sort((task1, task2)=> task1.dueDate - task2.dueDate)
    //         console.log(temp);
    //         // console.log(todoCompleted);
    //     }


    // }, [sortTask])

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

    // function onChangeHandlerSort(e:React.FormEvent){
    //     if(sortTask === ''{

    //     })
    //     todoCompleted
    // }


    return (
        <>
            <main>
                <div className="container">
                    <div className="d-flex text-secondary justify-content-between fw-semibold">
                        <div className="w-50 ">Task name</div>
                        <div className="d-flex  w-100 justify-content-between">
                            <div className="w-100">Due on</div>
                            <div className="w-100">Task Status</div>
                            <div className="w-100">Task Category</div>
                        </div>
                    </div>

                    <div>
                        {/* accordion-1 */}
                        <div className="accordion mt-3 " id="accordionPanelsStayOpenExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header ">
                                    <button className="accordion-button " type="button" data-bs-toggle="collapse"
                                        data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                        aria-controls="panelsStayOpen-collapseOne"
                                    >
                                        ToDo
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                                    <div className="accordion-body">
                                        {
                                            todoTasks?.length > 0 ? (
                                                todoTasks.map((task) => (
                                                    <div
                                                        key={task._id}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#updateModal"
                                                        data-bs-whatever="@mdo"
                                                        onClick={() => setSelectedTask(task)}
                                                        className="d-flex text-secondary justify-content-between fw-semibold" style={{ cursor: 'pointer' }}>

                                                        <div className="w-50 d-flex align-items-center gap-1 border-bottom">
                                                            <div className="d-flex align-items-center">
                                                                <BsCheckCircle style={{ width: "15px", height: "15px" }} />
                                                                <PiDotsSixVerticalLight />
                                                            </div>
                                                            <div className=" ">{task.title}</div>
                                                        </div>
                                                        <div className="d-flex border-bottom w-100 justify-content-between py-1">
                                                            <div className="w-100 ">{task.dueDate.split('-').reverse().join('-')}</div>
                                                            <div className="w-100 ">{task.status.toUpperCase()}</div>
                                                            <div className="w-100 ">{task.category}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center">No task in Todo</p>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* accordion-2 */}
                        <div className="accordion mt-3 " id="accordionPanelsStayOpenExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header ">
                                    <button className="accordion-button bg-warning" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true"
                                        aria-controls="panelsStayOpen-collapseTwo"
                                    >
                                        In-Progress
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show">
                                    <div className="accordion-body ">
                                        {
                                            inProgessTasks?.length > 0 ? (
                                                inProgessTasks.map((task) => (
                                                    <div
                                                        key={task._id}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#updateModal"
                                                        data-bs-whatever="@mdo"
                                                        onClick={() => setSelectedTask(task)}
                                                        className="d-flex text-secondary justify-content-between fw-semibold" style={{ cursor: 'pointer' }}>

                                                        <div className="w-50 d-flex gap-1 align-items-center border-bottom">
                                                            <div className="d-flex align-items-center">
                                                                <BsCheckCircle style={{ width: "15px", height: "15px" }} />
                                                                <PiDotsSixVerticalLight />
                                                            </div>
                                                            <div className=" ">{task.title}</div>
                                                        </div>
                                                        <div className="d-flex border-bottom w-100 justify-content-between py-1">
                                                            <div className="w-100 ">{task.dueDate.split('-').reverse().join('-')}</div>
                                                            <div className="w-100 ">{task.status.toUpperCase()}</div>
                                                            <div className="w-100 ">{task.category}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center">No task In-Progress</p>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* accordion-3 */}
                        <div className="accordion mt-3 " id="accordionPanelsStayOpenExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header ">
                                    <button className="accordion-button bg-success" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true"
                                        aria-controls="panelsStayOpen-collapseThree"
                                    >
                                        Completed
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse show">
                                    <div className="accordion-body">
                                        {
                                            todoCompleted?.length > 0 ? (
                                                todoCompleted.map((task) => (
                                                    <div
                                                        key={task._id}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#updateModal"
                                                        data-bs-whatever="@mdo"
                                                        onClick={() => setSelectedTask(task)}
                                                        className="d-flex text-secondary justify-content-between fw-semibold" style={{ cursor: 'pointer' }}>

                                                        <div className="w-50 align-items-center d-flex gap-1 border-bottom">
                                                            <div className="d-flex align-items-center">
                                                                <BsCheckCircleFill style={{ width: "15px", height: "15px" }} />
                                                                <PiDotsSixVerticalLight />
                                                            </div>
                                                            <div className="text-decoration-line-through">{task.title}</div>
                                                        </div>
                                                        <div className="d-flex border-bottom w-100 justify-content-between py-1">
                                                            <div className="w-100 ">{task.dueDate.split('-').reverse().join('-')}</div>
                                                            <div className="w-100 ">{task.status.toUpperCase()}</div>
                                                            <div className="w-100 ">{task.category}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center">No task in Completed</p>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
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
                                                        defaultValue={selectedTask?.status ? selectedTask?.status : 'Select'}
                                                        disabled={status == 'loading' ? true : false}
                                                        aria-label="Default select example">
                                                        <option value={selectedTask?.status} className="text-secondary" >{selectedTask?.status}</option>
                                                        <option value="todo">To-Do</option>
                                                        <option value="inProgress">In-Progress</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {
                                        width >= formCheckPoint && <div className="w-50 border-start px-1 bg-light">
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
                                            onClick={() => { deleteHandler(selectedTask?._id) }}
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