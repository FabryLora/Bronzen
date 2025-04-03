import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function ProductosLayout() {
    const { categorias, subCategorias } = useStateContext();
    const [orangeBorder, setOrangeBorder] = useState(false);
    const { id } = useParams();
    const location = useLocation();
    const pathname = location?.pathname?.split("/");
    const categoriaId = pathname[2];
    const subCategoriaId = pathname[3];

    return (
        <div className="">
            <div className="w-[1200px] mx-auto h-[93px] flex flex-col justify-between">
                <div className="w-full flex justify-end">
                    <div className="w-[300px] flex flex-row gap-2 items-center border-b-[2px] py-1 justify-end">
                        <input
                            onFocus={() => setOrangeBorder(!orangeBorder)}
                            className="outline-none w-full"
                            type="text"
                        />
                        <Link>
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                size="2xl"
                            />
                        </Link>
                    </div>
                </div>
                <div className="w-full border-b-[3px] py-2 px-5 border-primary-orange">
                    <Link className="font-bold text-primary-gray">
                        LINEA{" "}
                        {
                            categorias?.find(
                                (categoria) =>
                                    categoria?.id == Number(categoriaId)
                            )?.name
                        }
                    </Link>
                    {subCategoriaId && (
                        <Link className=" text-primary-gray">
                            {" "}
                            <span className="font-bold mr-5">{">"}</span>
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
            <div className="w-[1200px] mx-auto">
                <Outlet />
            </div>
        </div>
    );
}
