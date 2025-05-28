// NuestrosProductos.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import loupe from "../assets/icons/WhiteLoupe.png";
import loupeBlack from "../assets/icons/loupe.png";
import { useStateContext } from "../context/ContextProvider";
import LineaComponent from "./LineaComponent";

export default function NuestrosProductos({ additionalStyles }) {
    const { categorias } = useStateContext();

    const [orangeBorder, setOrangeBorder] = useState(false);
    const [searchValue, setSearchValue] = useState(" ");

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            className={`min-h-[1043px] max-sm:min-h-0 bg-[#5b6771] ${additionalStyles?.container}`}
        >
            <div
                className={`w-[1200px] max-sm:w-full max-sm:px-4 mx-auto flex flex-col gap-7 ${
                    location.pathname.includes("/productos")
                        ? "pt-20 max-sm:pt-10"
                        : "py-20 max-sm:py-10"
                }`}
            >
                <div className="flex flex-row w-full max-sm:flex-col max-sm:items-center max-sm:text-center max-sm:gap-6">
                    <h2
                        className={` font-bold text-5xl max-sm:text-3xl w-2/3 ${additionalStyles?.title}`}
                    >
                        NUESTROS PRODUCTOS
                    </h2>
                    <div className="w-1/3 flex justify-end max-sm:justify-center max-sm:w-full">
                        <div
                            className={`w-[300px] max-sm:w-full flex flex-row gap-2 items-center  border-b-[2px]  justify-end ${
                                orangeBorder ? "border-primary-orange" : ""
                            } ${additionalStyles?.searchBorder}`}
                        >
                            <input
                                onChange={(e) => setSearchValue(e.target.value)}
                                className={`outline-none w-full  ${additionalStyles?.input}`}
                                type="text"
                                placeholder="Busca por código o descripción"
                            />
                            <Link
                                to={`/busqueda/${searchValue}`}
                                className="w-fit h-fit pr-4"
                            >
                                <img
                                    className="w-[35px] h-auto"
                                    src={
                                        additionalStyles?.loupe
                                            ? loupe
                                            : loupeBlack
                                    }
                                    alt=""
                                />
                            </Link>
                        </div>
                    </div>
                </div>

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
