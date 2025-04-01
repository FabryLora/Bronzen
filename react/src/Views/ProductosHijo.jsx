import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import axiosClient from "../axios";

export default function ProductosHijo() {
    const { id } = useParams();
    const [productosHijo, setProductosHijo] = useState([]);
    const [loading, setLoading] = useState(false);

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
            <div className="w-[1200px] mx-auto h-screen flex justify-center items-center">
                <PulseLoader color="#ff6600" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 justify-items-center py-8">
            {productosHijo?.map((subCategoria) => (
                <Link
                    to={`/productos/${id}/${subCategoria?.id}`}
                    className="flex flex-col h-[342px]"
                    key={subCategoria?.id}
                >
                    {subCategoria?.image ? (
                        <img
                            src={subCategoria?.image}
                            className="w-[269px] h-[271px] border-b-[2px] border-primary-orange"
                            alt=""
                        />
                    ) : (
                        <img
                            src={defaultPhoto}
                            className="w-[269px] h-[271px] border-b-[2px] border-primary-orange object-contain"
                            alt=""
                        />
                    )}

                    <h2 className="text-primary-orange font-bold text-sm pt-4">
                        {subCategoria?.name?.replace("DE ALUMINIO", "")}
                    </h2>
                </Link>
            ))}
        </div>
    );
}
