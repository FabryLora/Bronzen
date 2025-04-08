import {
    faFacebook,
    faFacebookF,
    faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function ProductoOnlyPrivada() {
    const { cart, addToCart } = useStateContext();
    const { id } = useParams();
    const [subProductos, setSubProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSubProduct, setCurrentSubProduct] = useState();
    const [currentMedida, setCurrentMedida] = useState();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/sub-productos/productos/${id}`)
            .then(({ data }) => {
                setSubProductos(data.data);
                setCurrentSubProduct(data.data[0]);
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
        <div className="relative flex w-[1200px] mx-auto py-20">
            <div className="absolute left-0 top-4 flex flex-row items-center gap-1 text-sm text-[#6E7173]">
                <Link to={"/privado/productos"} className="font-medium">
                    Productos
                </Link>
                <p>{">"}</p>
                <Link to={"#"}>{currentSubProduct?.producto}</Link>
            </div>
            {/* imagen */}
            <div className="flex flex-row w-full">
                <div className="relative">
                    <div className="min-w-[496px] h-[496px] border border-gray-300 rounded-lg flex justify-center">
                        <img
                            src={
                                currentSubProduct?.image
                                    ? currentSubProduct?.image
                                    : defaultPhoto
                            }
                            className="w-full h-full object-contain rounded-lg"
                            alt=""
                            onError={(e) => {
                                e.target.onerror = null; // prevents looping
                                e.target.src = defaultPhoto;
                            }}
                        />
                    </div>

                    <div className="absolute -left-24 top-0 flex flex-col gap-3">
                        {subProductos?.map((subProd) => (
                            <button
                                onClick={() => {
                                    setCurrentSubProduct(subProd);
                                }}
                                key={subProd?.id}
                                className={`w-[80px] h-[80px] rounded-lg border-primary-orange ${
                                    subProd?.id === currentSubProduct?.id
                                        ? "border"
                                        : ""
                                }`}
                            >
                                <img
                                    src={
                                        subProd?.image
                                            ? subProd?.image
                                            : defaultPhoto
                                    }
                                    className={`w-full rounded-lg h-full object-contain hover:opacity-100 transition duration-300 ${
                                        subProd?.id === currentSubProduct?.id
                                            ? ""
                                            : "opacity-50 border-gray-700 border"
                                    }`}
                                    alt=""
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-5 px-4">
                    <div className="flex flex-row gap-5">
                        <h2 className="text-2xl text-[#5A5754] font-bold">
                            {currentSubProduct?.code}
                        </h2>
                        <div className="flex flex-row justify-center items-center gap-2">
                            <h2 className="text-[22px] font-bold text-primary-gray">
                                {currentSubProduct?.categoria}
                            </h2>
                            <div className="h-full bg-[#5A5754] w-[2px] rounded-full"></div>
                            <h2 className="text-[22px] font-bold text-primary-gray">
                                {currentSubProduct?.subCategoria}
                            </h2>
                        </div>
                    </div>
                    <div className="w-full h-[0.5px] bg-gray-300"></div>
                    <div className="w-full flex flex-col gap-4 h-full justify-between">
                        <h1 className="text-[30px] font-medium text-[#222222] ">
                            {currentSubProduct?.producto}
                        </h1>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col gap-2">
                                <p className="text-[16px]">Precio</p>
                                <p className="font-semibold">
                                    $
                                    {Number(
                                        currentSubProduct?.precio_de_lista
                                    )?.toLocaleString("es-AR")}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[16px]">
                                    Precio con descuento
                                </p>
                                <p className="font-semibold">
                                    $
                                    {Number(
                                        currentSubProduct?.precio_de_lista
                                    )?.toLocaleString("es-AR")}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[16px]">Cantidad</p>
                                <p className="font-semibold">
                                    {currentSubProduct?.precio_de_lista}
                                </p>
                            </div>
                            <button className="w-[184px] h-[51px] text-white bg-primary-orange fon-bold rounded-full">
                                Agregar al pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
