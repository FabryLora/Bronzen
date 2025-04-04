import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axios";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useStateContext } from "../context/ContextProvider";

export default function PrivadaLayout() {
    const { userToken, setCurrentUser } = useStateContext();

    useEffect(() => {
        axiosClient.get("/me").then(({ data }) => {
            setCurrentUser(data);
        });
    }, []);

    if (!userToken) {
        return <Navigate to={"/"} />;
    }

    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
}
