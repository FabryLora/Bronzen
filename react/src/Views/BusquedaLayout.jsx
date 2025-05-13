import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import loupe from "../assets/icons/loupe.png";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import axiosClient from "../axios";

export default function BusquedaLayout() {
    const [productosBusqueda, setProductosBusqueda] = useState([]);
    const [busquedaValue, setBusquedaValue] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        axiosClient
            .get(`/busqueda/${id}`)
            .then(({ data }) => {
                setProductosBusqueda(data.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const soloPrimeraMaysucula = (str) => {
        return str?.charAt(0)?.toUpperCase() + str?.slice(1);
    };

    const { id } = useParams();

    return (
        <div className="">
            <div className="w-[1200px] max-sm:w-full max-sm:px-4 mx-auto h-[93px] max-sm:h-auto max-sm:py-4 flex flex-col justify-between">
                <div className="w-full flex justify-end max-sm:justify-center">
                    <div
                        className={`w-[300px] max-sm:w-full flex flex-row gap-2 items-center border-b-[2px] py-1 justify-end `}
                    >
                        <input
                            onChange={(e) => setBusquedaValue(e.target.value)}
                            className="outline-none w-full"
                            type="text"
                        />
                        <a
                            href={`/busqueda/${
                                busquedaValue ? busquedaValue : "%20"
                            }`}
                            className="w-fit h-fit pr-4"
                        >
                            <img
                                className="w-[35px] h-auto"
                                src={loupe}
                                alt=""
                            />
                        </a>
                    </div>
                </div>
                <div className="w-full border-b-[3px] py-2 px-5 max-sm:px-2 max-sm:mt-4 border-primary-orange">
                    <p className="font-bold text-[15px] uppercase text-[#5B6670]">
                        Resultados de tu búsqueda "{id}"
                    </p>
                </div>
            </div>
            <div className="w-[1200px] max-sm:w-full max-sm:px-4 mx-auto">
                {loading ? (
                    <div className="w-[1200px] max-sm:w-full mx-auto h-screen flex justify-center items-center">
                        <PulseLoader color="#ff6600" />
                    </div>
                ) : productosBusqueda?.length === 0 ? (
                    <div className="w-[1200px] max-sm:w-full mx-auto h-[50vh] flex justify-center items-center">
                        <p className="text-[14px] text-[#62707b]">
                            Lo sentimos. No hay productos que coinciden con tu
                            búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 max-sm:grid-cols-1 max-sm:gap-8 justify-items-center py-8">
                        {productosBusqueda?.map((prod) => (
                            <Link
                                to={`/productos/${prod?.categoriaId}/${prod?.subCategoriaId}/${prod?.id}`}
                                className="flex flex-col h-fit max-sm:h-auto max-sm:w-full max-sm:items-center gap-2"
                                key={prod?.id}
                            >
                                <img
                                    src={
                                        prod?.image ? prod?.image : defaultPhoto
                                    }
                                    className="w-[269px] max-sm:w-[80%] min-h-[271px] max-sm:h-auto max-sm:aspect-square border-b-[2px] border-primary-orange object-contain"
                                    alt=""
                                />

                                <h2 className="text-[#5B6670] font-bold text-[16px] pt-2 w-[90%] max-sm:text-center max-sm:w-full break-words">
                                    {prod?.name}
                                </h2>
                                <div className="flex flex-row">
                                    {[
                                        ...new Set(
                                            prod?.subProductos
                                                ?.filter((elem) => elem?.color)
                                                ?.map((elem) => elem?.color)
                                        ),
                                    ]?.map((elem) => (
                                        <span
                                            className="text-[10px] text-[#62707b]"
                                            key={elem}
                                        >
                                            {elem} <span> / </span>
                                        </span>
                                    ))}
                                    {prod?.plano && (
                                        <span className="text-[10px] text-[#62707b]">
                                            Detalle tecnico
                                        </span>
                                    )}
                                </div>
                                <div className="h-[2px] w-[40px] bg-primary-orange"></div>
                                <div className="flex flex-row text-[10px] text-[#c96] gap-1">
                                    <Link
                                        to={`/productos/${prod?.categoriaId}`}
                                        className="hover:text-[#b18458] transition duration-300"
                                    >
                                        {soloPrimeraMaysucula(prod?.categoria)}
                                    </Link>
                                    <p className="text-gray-500">{">"}</p>
                                    <Link
                                        to={`/productos/${prod?.categoriaId}/${prod?.subCategoriaId}`}
                                        className="hover:text-[#b18458] transition duration-300"
                                    >
                                        {soloPrimeraMaysucula(
                                            prod?.subCategoria
                                        )}
                                    </Link>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
