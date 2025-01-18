import React from "react";
import { Header } from "./components/common/Header";
import { Outlet } from "react-router-dom";


export const Layout:React.FC = () =>{
    return(
        <>
        <Header />
        <Outlet />

        </>
    )
}