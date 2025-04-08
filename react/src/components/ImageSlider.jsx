import React, { useEffect } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Importar estilos de Swiper
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { useStateContext } from "../context/ContextProvider";
// Importar FontAwesome (asegúrate de tenerlo instalado)
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ImageSlider() {
    const { subProductos, fetchSubProductos } = useStateContext();

    useEffect(() => {
        fetchSubProductos();
    }, []);

    return (
        <div className="w-full h-full relative overflow-x-hidden">
            {/* Estilos para ocultar las flechas predeterminadas de Swiper */}
            <style>
                {`
                    .swiper-button-next::after,
                    .swiper-button-prev::after {
                        display: none;
                    }
                `}
            </style>

            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                centeredSlides={true}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                loop={true}
                autoplay={{
                    delay: 9000,
                    disableOnInteraction: false,
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    padding: "20px 0px",
                }}
            >
                {subProductos
                    ?.filter((prod) => prod?.image != null)
                    ?.slice(0, 4)
                    ?.map((subprod, index) => (
                        <SwiperSlide
                            className="cursor-grab"
                            key={index}
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div className="flex flex-col w-full h-full">
                                <img
                                    src={subprod?.image}
                                    className="w-full h-[90%] object-contain"
                                />
                                <div className="h-[10%] w-full flex flex-col items-end gap-2 max-sm:items-center ">
                                    <h2 className="text-[#5b6670] text-[17px] max-sm:text-[15px]">
                                        {subprod?.name}
                                    </h2>
                                    <Link
                                        to={`/productos/${subprod?.categoriaId}/${subprod?.subCategoriaId}/${subprod?.productoId}`}
                                        className="text-primary-orange text-sm"
                                    >
                                        {subprod?.code}
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}

                {/* Flechas de navegación personalizadas con FontAwesome */}
                <div
                    className="swiper-button-prev flex items-center justify-center max-sm:left-2"
                    style={{
                        color: "gray",
                        position: "absolute",
                        top: "50%",
                        left: "30px",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        cursor: "pointer",
                        width: "22px",
                        height: "22px",
                    }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </div>
                <div
                    className="swiper-button-next flex items-center justify-center max-sm:right-2"
                    style={{
                        color: "gray",
                        position: "absolute",
                        top: "50%",
                        right: "30px",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        cursor: "pointer",
                        width: "22px",
                        height: "22px",
                    }}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </Swiper>
        </div>
    );
}
