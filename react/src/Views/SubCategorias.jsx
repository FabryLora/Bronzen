import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function SubCategorias() {
    const { subProductos } = useStateContext();
    const { id } = useParams();
    const [subCategorias, setSubCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/sub-categories/categories/${id}`)
            .then(({ data }) => {
                setSubCategorias(data.data);
            })
            .catch((error) => {
                console.error("Error al obtener subcategorías:", error);
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
            {subCategorias?.map((subCategoria) => (
                <Link
                    to={`/productos/${id}/${subCategoria?.id}`}
                    className="flex flex-col h-[342px] max-sm:h-auto max-sm:w-full max-sm:items-center"
                    key={subCategoria?.id}
                >
                    {subProductos?.find(
                        (subprod) =>
                            subprod?.subCategoriaId === subCategoria?.id
                    )?.image ? (
                        <img
                            src={
                                subProductos?.find(
                                    (subprod) =>
                                        subprod?.subCategoriaId ===
                                        subCategoria?.id
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
                    <h2 className="text-primary-orange font-bold text-sm pt-4 max-sm:text-center">
                        {subCategoria?.name?.replace("DE ALUMINIO", "")}
                    </h2>
                </Link>
            ))}
        </div>
    );
}
