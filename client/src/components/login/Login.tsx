// import { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { LuClipboardList } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../features/auth";
import { AppDispatch, RootState } from "../../app/store";
import './style.css'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../loadingSpinner/Loader";

const Login: React.FC = () => {
    const { status } = useSelector((state: RootState) => state.auth)

    // const handlerLogin = () =>{
    // console.log("Login function");

    // }
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    useEffect(() => {
        if (status === 'success') {
            navigate("/home")
        }
    }, [status])


    async function handlerLogin(): Promise<void> {

        try {
            const response = await signInWithPopup(auth, googleProvider);
            // console.log(response?.user);
            dispatch(signupUser(response?.user?.accessToken))
        } catch (error) {
            console.log(error);
        }
    }

    // async function handlerLogout(): Promise<void> {
    //     try {
    //         await signOut(auth)
    //         console.log(auth);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    return (
        <>
            {
                status === 'loading' ? (
                    <Loader />
                )
                    : (<main className="login ">
                        <section className="container vh-100 d-flex flex-column justify-content-center align-items-center">

                            <div className="p-1 d-flex flex-column " style={{ maxWidth: "19.5rem" }}>
                                <div className="d-flex gap-2 align-items-center  justify-content-center justify-content-lg-start  fw-semibold " style={{ fontSize: "2rem", color: "#7B1984", }} >
                                    <LuClipboardList />
                                    <span>Task Buddy</span>
                                </div>
                                <div className="text-center text-lg-start" style={{ fontSize: "11.64px" }}>
                                    Streamline your workflow and track progress effortlessly with our all-in-one task management app.
                                </div>
                            </div>

                            <div className="mt-4 p-2" style={{ minWidth: "19.5rem" }}>
                                <div
                                    onClick={() => handlerLogin()}
                                    className="d-flex justify-content-center gap-2 border w-100 p-2 btn btn-lg fw-semibold shadow">
                                    <div>
                                        <FcGoogle style={{ width: "24px", height: "24px" }} />
                                    </div>
                                    <div>
                                        Continue with Google
                                    </div>
                                </div>
                            </div>
                            {/* <p
                                onClick={() => handlerLogout()}
                                className="btn btn-danger"
                            >
                                Logout
                            </p> */}
                        </section>
                    </main>)
            }
        </>
    )

}

export default Login