import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import loupe from "../assets/icons/loupe.png";
import { useStateContext } from "../context/ContextProvider";

export default function ProductosLayout() {
    const { categorias, subCategorias } = useStateContext();
    const [orangeBorder, setOrangeBorder] = useState(false);
    const [searchValue, setsearchValue] = useState("");
    const { id } = useParams();
    const location = useLocation();
    const pathname = location?.pathname?.split("/");
    const categoriaId = pathname[2];
    const subCategoriaId = pathname[3];

    return (
        <div className="">
            <div className="w-[1200px] max-sm:w-full max-sm:px-4 mx-auto h-[93px] max-sm:h-auto max-sm:py-4 flex flex-col justify-between">
                <div className="w-full flex justify-end max-sm:justify-center">
                    <div
                        className={`w-[300px] max-sm:w-full flex flex-row gap-2 items-center border-b-[2px] py-1 justify-end ${
                            orangeBorder ? "border-primary-orange" : ""
                        }`}
                    >
                        <input
                            onChange={(e) => setsearchValue(e.target.value)}
                            className="outline-none w-full"
                            type="text"
                        />
                        <Link
                            to={`/busqueda/${
                                searchValue ? searchValue : "%20"
                            }`}
                            className="w-fit h-fit pr-4"
                        >
                            <img
                                className="w-[35px] h-auto"
                                src={loupe}
                                alt=""
                            />
                        </Link>
                    </div>
                </div>
                <div className="w-full border-b-[3px] py-2 px-5 max-sm:px-2 max-sm:mt-4 border-primary-orange">
                    <Link className="font-bold text-primary-gray max-sm:text-sm">
                        LINEA{" "}
                        {
                            categorias?.find(
                                (categoria) =>
                                    categoria?.id == Number(categoriaId)
                            )?.name
                        }
                    </Link>
                    {subCategoriaId && (
                        <Link className="text-primary-gray max-sm:text-sm">
                            {" "}
                            <span className="font-bold mr-5 max-sm:mr-2">
                                {">"}
                            </span>
                            {
                                subCategorias?.find(
                                    (categoria) =>
                                        categoria?.id == Number(subCategoriaId)
                                )?.name
                            }
                        </Link>
                    )}
                </div>
            </div>
            <div className="w-[1200px] max-sm:w-full max-sm:px-4 mx-auto">
                <Outlet />
            </div>
        </div>
    );
}
