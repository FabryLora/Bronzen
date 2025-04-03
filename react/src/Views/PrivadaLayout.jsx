import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { useStateContext } from "../context/ContextProvider";

export default function PrivadaLayout() {
    const { userToken } = useStateContext();

    if (!userToken) {
        return <Navigate to={"/"} />;
    }

    return (
        <>
            <NavBar />
        </>
    );
}
