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

export default function ProductoOnly() {
    const { contactInfo } = useStateContext();
    const { id } = useParams();
    const [subProductos, setSubProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSubProduct, setCurrentSubProduct] = useState();
    const [currentMedida, setCurrentMedida] = useState();

    const location = useLocation();
    const currentUrl = window.location.origin + location.pathname;

    const soloNumeros = (str) => {
        const regex = /\d+/g;
        const matches = str.match(regex);
        return matches ? matches.join("") : "";
    };

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
                // Inicializar currentMedida con la medida del primer subproducto (si existe)
                if (data.data[0]?.medida) {
                    setCurrentMedida(data.data[0].medida);
                }
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

    const socialLinks = [
        {
            icon: faFacebookF,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                currentUrl
            )}`,
        },
        {
            icon: faEnvelope,
            href: `mailto:?subject=Mirá este producto&body= ${encodeURIComponent(
                currentUrl
            )}`,
        },
        {
            icon: faWhatsapp,
            href: `https://wa.me/?text=${encodeURIComponent(`${currentUrl}`)}`,
        },
    ];

    return (
        <div className="flex w-full h-fit pb-40 max-sm:pb-20">
            {/* imagen */}
            <div className="flex flex-row max-sm:flex-col w-full h-fit">
                <div className="relative min-w-[376px] max-sm:min-w-0 max-sm:w-full h-fit max-sm:h-fit  max-sm:mb-20">
                    <img
                        src={
                            currentSubProduct?.image
                                ? currentSubProduct?.image
                                : defaultPhoto
                        }
                        className=" h-[377px] object-contain w-[376px] max-sm:max-w-full"
                        alt=""
                        onError={(e) => {
                            e.target.onerror = null; // prevents looping
                            e.target.src = defaultPhoto;
                        }}
                    />
                    <div className="border-t-2 py-3 border-primary-orange grid grid-cols-3 max-sm:relative max-sm:bottom-0 max-sm:mt-4 max-sm:mb-8 gap-3 max-sm:flex-wrap max-sm:justify-center mt-3">
                        {subProductos?.map((subProd) => (
                            <button
                                onClick={() => {
                                    setCurrentSubProduct(subProd);
                                }}
                                key={subProd?.id}
                                className={`w-[96px] max-sm:w-[70px] h-[86px] max-sm:h-[70px] border-primary-orange ${
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
                                    className={`w-full h-full object-contain hover:opacity-100 transition duration-300 ${
                                        subProd?.id === currentSubProduct?.id
                                            ? ""
                                            : "opacity-50"
                                    }`}
                                    alt=""
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-10 max-sm:gap-6 p-4">
                    <div className="flex flex-col max-sm:items-center">
                        <h2 className="text-2xl text-primary-orange font-bold">
                            {currentSubProduct?.code}
                        </h2>
                        <h2 className="text-[22px] font-bold text-primary-gray max-sm:text-center">
                            {currentSubProduct?.producto}
                        </h2>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <p className="text-sm text-primary-gray border-primary-gray border-b max-sm:text-center">
                            Disponible en:
                        </p>
                        <div className="flex flex-col px-1 py-4 gap-10 max-sm:gap-6">
                            <div className="grid grid-cols-6 gap-x-2 gap-y-5 w-fit max-sm:flex-wrap max-sm:justify-center max-sm:gap-4">
                                {[
                                    ...new Map(
                                        subProductos
                                            ?.filter((prod) => prod.color)
                                            ?.map((item) => [item.color, item])
                                    ).values(),
                                ]?.map((subProd) => (
                                    <div
                                        key={subProd?.id}
                                        className="flex flex-col min-w-[124px] max-sm:min-w-[80px] gap-1 items-center justify-center"
                                    >
                                        <button
                                            onClick={() => {
                                                setCurrentSubProduct(subProd);
                                            }}
                                            className={`w-[15px] h-[15px] rounded-full border border-primary-orange hover:bg-primary-orange transition duration-300 ${
                                                currentSubProduct?.id ===
                                                    subProd?.id ||
                                                currentSubProduct?.color ==
                                                    subProd?.color
                                                    ? "bg-primary-orange border-gray"
                                                    : ""
                                            }`}
                                        ></button>
                                        <p className="text-xs text-center text-primary-gray">
                                            {subProd?.color}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {/* Reemplaza el div actual de medidas con este código */}
                            <div className="flex flex-row gap-x-2 max-sm:flex-wrap max-sm:justify-center max-sm:gap-4">
                                {/* Filtramos solo los que tienen medida y eliminamos duplicados */}
                                {Array.from(
                                    new Set(
                                        subProductos
                                            .filter(
                                                (subProd) =>
                                                    subProd?.medida &&
                                                    subProd.medida.trim() !== ""
                                            )
                                            .map((subProd) => subProd.medida)
                                    )
                                ).map((medida, index) => (
                                    <div
                                        key={index}
                                        className="flex min-w-[124px] max-sm:min-w-[80px] flex-col gap-1 items-center justify-center"
                                    >
                                        <button
                                            onClick={() => {
                                                setCurrentMedida(medida);
                                                // Opcionalmente, seleccionar el primer subproducto con esta medida
                                                const subProdWithMedida =
                                                    subProductos.find(
                                                        (sp) =>
                                                            sp.medida === medida
                                                    );
                                                if (subProdWithMedida) {
                                                    setCurrentSubProduct(
                                                        subProdWithMedida
                                                    );
                                                }
                                            }}
                                            className={`w-[15px] h-[15px] rounded-full border border-primary-orange hover:bg-primary-orange transition duration-300 ${
                                                currentMedida === medida
                                                    ? "bg-primary-orange border-gray"
                                                    : ""
                                            }`}
                                        ></button>
                                        <p className="text-xs text-primary-gray">
                                            {medida}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-end max-sm:justify-center items-center gap-2">
                        <p className="text-sm text-primary-gray">Compartir:</p>
                        <div className="flex flex-row gap-2">
                            {socialLinks?.map((link, index) => (
                                <a
                                    href={link.href}
                                    key={index}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center rounded-full w-[40px] h-[40px] border border-gray-200 hover:border-[#c96] transition duration-300"
                                >
                                    <FontAwesomeIcon
                                        icon={link.icon}
                                        size="lg"
                                        color="#ff9e19"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
