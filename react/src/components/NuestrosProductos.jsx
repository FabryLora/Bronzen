// NuestrosProductos.jsx
import React from "react";
import { useStateContext } from "../context/ContextProvider";
import LineaComponent from "./LineaComponent";

export default function NuestrosProductos() {
    const { categorias } = useStateContext();

    return (
        <div className="min-h-[1043px] bg-[#5b6771]">
            <div className="w-[1200px] mx-auto py-20 flex flex-col gap-7">
                <h2 className="text-white font-bold text-5xl">
                    NUESTROS PRODUCTOS
                </h2>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 justify-items-center">
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
        </div>
    );
}
