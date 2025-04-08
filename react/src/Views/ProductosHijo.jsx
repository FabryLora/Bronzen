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
                    to={`${location.pathname}/${prod?.id}`}
                    className="flex flex-col h-[342px] max-sm:h-auto max-sm:w-full max-sm:items-center"
                    key={prod?.id}
                >
                    {subProductos?.find(
                        (subprod) => subprod?.productoId === prod?.id
                    )?.image ? (
                        <img
                            src={
                                subProductos?.find(
                                    (subprod) =>
                                        subprod?.productoId === prod?.id
                                )?.image
                            }
                            className="w-[269px] max-sm:w-[80%] h-[271px] max-sm:h-auto max-sm:aspect-square border-b-[2px] border-primary-orange object-contain"
                            alt=""
                        />
                    ) : (
                        <img
                            src={defaultPhoto}
                            className="w-[269px] max-sm:w-[80%] h-[271px] max-sm:h-auto max-sm:aspect-square border-b-[2px] border-primary-orange object-contain"
                            alt=""
                        />
                    )}

                    <h2 className="text-primary-orange font-bold text-sm pt-4 w-[90%] max-sm:text-center max-sm:w-full break-words">
                        {prod?.name}
                    </h2>
                </Link>
            ))}
        </div>
    );
}
