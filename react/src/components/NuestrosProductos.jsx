// NuestrosProductos.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import LineaComponent from "./LineaComponent";

export default function NuestrosProductos() {
    const { categorias } = useStateContext();

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-[1043px] max-sm:min-h-0 bg-[#5b6771]">
            <div
                className={`w-[1200px] max-sm:w-full max-sm:px-4 mx-auto flex flex-col gap-7 ${
                    location.pathname.includes("/productos")
                        ? "pt-20 max-sm:pt-10"
                        : "py-20 max-sm:py-10"
                }`}
            >
                <h2 className="text-white font-bold text-5xl max-sm:text-3xl">
                    NUESTROS PRODUCTOS
                </h2>
                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-y-6 gap-x-4 justify-items-center">
                    {categorias
                        ?.slice()
                        .sort((a, b) => {
                            if (a.orden === null && b.orden === null) {
                                return a.name.localeCompare(b.name); // Ordenar por nombre si ambos orden son null
                            }
                            if (a.orden === null) return 1; // Mover 'a' al final si no tiene orden
                            if (b.orden === null) return -1; // Mover 'b' al final si no tiene orden
                            return a.orden.localeCompare(b.orden); // Ordenar por orden si ambos tienen
                        })
                        .map((categoria) => (
                            <LineaComponent
                                categoriaObject={categoria}
                                key={categoria?.id}
                            />
                        ))}
                </div>
            </div>
            {location.pathname.includes("/productos") && (
                <div className="flex py-10 max-sm:py-6 justify-center items-center w-full">
                    <h2 className="text-4xl max-sm:text-2xl text-primary-orange font-medium">
                        Estamos en todo
                    </h2>
                </div>
            )}
        </div>
    );
}
