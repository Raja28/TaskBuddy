import { Navigate } from "react-router-dom";

import { PropsWithChildren } from "react";
type ProtectedRouteProps = PropsWithChildren

export default function OpenRoute({ children }: ProtectedRouteProps) {

    const token: string | null = localStorage.getItem('accessToken')
   
    if (token === null) {
        return children;
    }
   
    return <Navigate to={"/home"} />

}