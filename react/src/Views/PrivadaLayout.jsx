import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import wpIcon from "../assets/icons/wp-icon.png";
import axiosClient from "../axios";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useStateContext } from "../context/ContextProvider";

export default function PrivadaLayout() {
    const { userToken, setCurrentUser, fetchInformacion, contactInfo } =
        useStateContext();

    useEffect(() => {
        axiosClient.get("/me").then(({ data }) => {
            setCurrentUser(data);
        });
        fetchInformacion();
    }, []);

    if (!userToken) {
        return <Navigate to={"/"} />;
    }

    const soloDejarNumeros = (number) => {
        if (number) {
            const cleanedNumber = number.replace(/\D/g, "");
            return `https://wa.me/${cleanedNumber}`;
        }
        return "";
    };

    return (
        <>
            <NavBar />
            <Outlet />
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-0 left-0"
                href={soloDejarNumeros(contactInfo?.wp)}
            >
                <img src={wpIcon} alt="" />
            </a>
            <Footer />
        </>
    );
}
