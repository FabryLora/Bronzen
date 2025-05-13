import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function ProductosHijo() {
    const { subProductos } = useStateContext();
    const { id } = useParams();
    const [productosHijo, setProductosHijo] = useState([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const soloPrimeraMaysucula = (str) => {
        return str?.charAt(0)?.toUpperCase() + str?.slice(1);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/productos/sub-categories/${id}`)
            .then(({ data }) => {
                setProductosHijo(data.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="w-[1200px] max-sm:w-full mx-auto h-screen flex justify-center items-center">
                <PulseLoader color="#ff6600" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 max-sm:grid-cols-1 max-sm:gap-8 justify-items-center py-8">
            {productosHijo?.map((prod) => (
                <Link
                    to={`/productos/${prod?.categoriaId}/${prod?.subCategoriaId}/${prod?.id}`}
                    className="flex flex-col h-fit max-sm:h-auto max-sm:w-full max-sm:items-center gap-2"
                    key={prod?.id}
                >
                    {prod?.image ? (
                        <img
                            src={prod?.image || defaultPhoto}
                            className="w-[269px] max-sm:w-[80%] min-h-[271px] max-sm:h-auto max-sm:aspect-square border-b-[2px] border-primary-orange object-contain"
                            alt=""
                        />
                    ) : (
                        <img
                            src={
                                prod?.image
                                    ? prod?.image
                                    : subProductos?.find(
                                          (subProducto) =>
                                              subProducto?.productoId ==
                                              prod?.id
                                      )?.image
                                    ? subProductos?.find(
                                          (subProducto) =>
                                              subProducto?.productoId ==
                                              prod?.id
                                      )?.image
                                    : defaultPhoto
                            }
                            className="w-[269px] max-sm:w-[80%] min-h-[271px] max-sm:h-auto max-sm:aspect-square border-b-[2px] border-primary-orange object-contain"
                            alt=""
                        />
                    )}

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
                            {soloPrimeraMaysucula(prod?.subCategoria)}
                        </Link>
                    </div>
                </Link>
            ))}
        </div>
    );
}
