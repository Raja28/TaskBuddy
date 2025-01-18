import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux"
import { setLogout } from "../../features/auth";
import { useNavigate } from "react-router-dom";

export const Profile: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    function handlerLogout() {
        dispatch(setLogout())
        toast.success('Logout Successful')
        navigate("/")
    }
    return (
        <>
            <main>
                <section className="container">
                    <div className="d-flex justify-content-center">
                        {/* left */}
                        <div className="mt-4 row col-md-6 ">
                            <div className="card p-3 m-3   d-flex flex-column align-items-center justify-content-center">
                                <div className="" style={{ maxWidth: "10rem", maxHeight: "10rem" }}>
                                    <img src={user?.picture} alt="user-avatar" className="card-img-top img-fluid  rounded-circle" />
                                </div>
                                <div className="card-body text-center">
                                    <p className=" fw-semibold">
                                        <strong>Name: </strong>
                                        {user?.name}
                                    </p>
                                    <p className=" fw-semibold">
                                        <strong>Email: </strong>
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="card border-0  m-3">
                                <button
                                    onClick={() => handlerLogout()}
                                    className="rounded btn btn-danger" >
                                    Logout
                                </button>
                            </div>
                        </div>


                    </div>
                </section>
            </main>
        </>
    )
}