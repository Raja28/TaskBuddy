import { Link, useNavigate } from "react-router-dom"
import { LuClipboardList } from "react-icons/lu";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { TbLogout2 } from "react-icons/tb";
import { setLogout } from "../../features/auth";

import { CiViewList } from "react-icons/ci";
import { CiViewBoard } from "react-icons/ci";

import toast from "react-hot-toast";
import { setView } from "../../features/tasks";


const screenMinWidth: number = 450
const taskMinWidth: number = 768

export const Header: React.FC = () => {
    const { width } = useWindowDimensions()
    const { user } = useSelector((state: RootState) => state.auth)
    const { viewTaskAsList } = useSelector((state: RootState) => state.tasks)
    // const [todoListView, setTodoListView] = useState<boolean>(false)

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    function handlerLogout() {
        dispatch(setLogout())
        toast.success('Logout Successful')
        navigate("/")
    }

    return (
        <>
            <header className="">
                <nav className="navbar border-bottom shadow-sm">
                    <div className="container">

                        <div>


                            <Link to={"/home"}
                                className="btn btn-lg p-1  fw-semibold d-flex align-items-center "
                                style={{ color: "#7B1984", }}
                            >
                                {width >= screenMinWidth && <LuClipboardList className="" />}
                                Task Buddy
                            </Link>
                            {
                                width >= taskMinWidth && (
                                    <div className="mt-2 d-flex gap-3 px-1">
                                        <div
                                            role="button"
                                            onClick={() => dispatch(setView())}
                                            className={viewTaskAsList ? `d-flex align-items-center gap-1 text-warning` : `d-flex align-items-center gap-1 text-secondary`}>
                                            <CiViewList /> <span>List</span>
                                        </div>
                                        <div
                                            role="button"
                                            onClick={() => dispatch(setView())}
                                            className={!viewTaskAsList ? `d-flex align-items-center gap-1 text-warning` : `d-flex align-items-center gap-1 text-secondary`}>
                                            <CiViewBoard /> <span>Board</span>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                        <div className="">
                            <div className="navbar-nav">
                                <div className="nav-item d-flex gap-2 align-items-center">
                                    {
                                        width >= screenMinWidth && <div>
                                            {user?.name}
                                        </div>
                                    }
                                    <Link
                                        to={'/dashboard/profile'}
                                        style={{ maxHeight: "2.7rem", maxWidth: "2.7rem" }}>
                                        <img src={user?.picture} loading="eager" className="rounded-circle img-fluid w-100 h-100" alt="user-image" />
                                    </Link>
                                </div>

                                {
                                    width >= screenMinWidth && <button
                                        onClick={() => handlerLogout()}
                                        className="btn btn-sm btn-info mt-2 rounded-pill px-1"
                                    >
                                        <TbLogout2 className="mx-2" />
                                        Logout
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </nav>

            </header>
        </>
    )
}