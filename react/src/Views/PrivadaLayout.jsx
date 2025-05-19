import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import wpIcon from "../assets/icons/wp-icon.png";
import axiosClient from "../axios";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useStateContext } from "../context/ContextProvider";

export default function PrivadaLayout() {
    const {
        userToken,
        setCurrentUser,
        fetchInformacion,
        contactInfo,
        vendedorView,
        setVendedorView,
        currentUserSelected,
        setCurrentIvaSelected,
        allUsers,
        setCurrentUserSelected,
    } = useStateContext();

    const [seacrhClientesView, setSeacrhClientesView] = useState(false);
    const [searchValue, setsearchValue] = useState("");

    useEffect(() => {
        axiosClient.get("/me").then(({ data }) => {
            setCurrentUser(data);
        });
        fetchInformacion();
    }, []);

    if (!userToken) {
        return <Navigate to={"/"} />;
    }

    const setUsuarioVendedor = async (userId) => {
        try {
            // Crear la promesa
            const promesa = axiosClient.get(`/showuser/${userId}`);

            // Mostrar toast durante la promesa
            toast.promise(promesa, {
                loading: "Seleccionando cliente...",
                success: "Cliente seleccionado",
                error: (err) => `${err.response.data.message}`,
            });

            // Esperar la respuesta
            const response = await promesa;
            console.log(response);

            // Ahora puedes acceder a los datos
            setCurrentUserSelected(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const soloDejarNumeros = (number) => {
        if (number) {
            const cleanedNumber = number.replace(/\D/g, "");
            return `https://wa.me/${cleanedNumber}`;
        }
        return "";
    };

    return (
        <>
            <Toaster />
            <NavBar />
            <Outlet />
            {vendedorView && (
                <AnimatePresence>
                    {vendedorView && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg p-6 w-[300px] sm:w-[500px] flex flex-col gap-4"
                            >
                                <div className="flex flex-col gap-2 relative">
                                    <label htmlFor="cliente">
                                        Elegir cliente
                                    </label>
                                    <input
                                        onFocus={() =>
                                            setSeacrhClientesView(true)
                                        }
                                        onChange={(e) => {
                                            setsearchValue(e.target.value);
                                            setSeacrhClientesView(true);
                                        }}
                                        onBlur={(e) => {
                                            // Verificamos si el clic fue dentro de la lista de resultados
                                            if (
                                                !e.relatedTarget ||
                                                !e.relatedTarget.closest(
                                                    ".search-results-container"
                                                )
                                            ) {
                                                setSeacrhClientesView(false);
                                            }
                                        }}
                                        className="h-[42px] outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                                        type="text"
                                        placeholder={
                                            currentUserSelected
                                                ? currentUserSelected?.name
                                                : "Buscar cliente..."
                                        }
                                    />
                                    {seacrhClientesView && (
                                        <div className="absolute top-20 left-0 w-full bg-white shadow-lg rounded-lg p-4 max-h-[200px] overflow-y-auto scrollbar-hide search-results-container">
                                            <p className="text-black font-bold text-xl py-2">
                                                Resultados de búsqueda
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                {allUsers
                                                    ?.filter(
                                                        (u) =>
                                                            u?.name?.includes(
                                                                searchValue
                                                            ) &&
                                                            u?.tipo !=
                                                                "vendedor"
                                                    )
                                                    ?.map((user) => (
                                                        <button
                                                            key={user?.id}
                                                            onClick={() => {
                                                                setUsuarioVendedor(
                                                                    user?.id
                                                                );
                                                                setSeacrhClientesView(
                                                                    false
                                                                );
                                                            }}
                                                            className="text-start py-2 border-b border-gray-200 hover:bg-gray-100 transition duration-300"
                                                        >
                                                            {user?.name}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="iva">Elegir IVA</label>
                                    <select
                                        onChange={(e) => {
                                            setCurrentIvaSelected(
                                                e.target.value
                                            );
                                        }}
                                        className="h-[42px] outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                                        name=""
                                        id="iva"
                                    >
                                        <option selected disabled value="">
                                            Seleccionar IVA
                                        </option>
                                        <option
                                            className="text-black"
                                            value="21"
                                        >
                                            IVA 21%
                                        </option>
                                        <option
                                            className="text-black"
                                            value="10.5"
                                        >
                                            IVA 10,5%
                                        </option>
                                    </select>
                                </div>
                                <div className="flex flex-row gap-4 justify-end">
                                    <button
                                        onClick={() => {
                                            setVendedorView(false);
                                        }}
                                        className="bg-primary-orange text-white rounded-full w-[105px] h-[42px] font-bold"
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            )}
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
