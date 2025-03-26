import React from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Importar estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";

export default function CubierteroSlider() {
    const organizadores = [
        {
            color: "white",
            codigo: "LC-315",
            image: " https://picsum.photos/id/237/200/300",
        },
        {
            color: "gray",
            codigo: "LC-315",
            image: " https://picsum.photos/id/236/200/300",
        },
        {
            color: "white",
            codigo: "LC-315",
            image: " https://picsum.photos/id/235/200/300",
        },
        {
            color: "gray",
            codigo: "LC-315",
            image: " https://picsum.photos/id/234/200/300",
        },
        {
            color: "white",
            codigo: "LC-315",
            image: " https://picsum.photos/id/233/200/300",
        },
        {
            color: "gray",
            codigo: "LC-315",
            image: " https://picsum.photos/id/232/200/300",
        },
    ];

    return (
        <div className="w-full h-full relative overflow-x-hidden">
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
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                {organizadores.map((organizador, index) => (
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
                        <div className="w-full h-full">
                            <img
                                src={organizador.image}
                                alt={`Cubiertero ${organizador.color}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}

                {/* Flechas de navegación personalizadas */}
                <div
                    className="swiper-button-prev"
                    style={{
                        color: "gray",
                        position: "absolute",
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        cursor: "pointer",
                    }}
                ></div>
                <div
                    className="swiper-button-next text-"
                    style={{
                        color: "gray",
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        cursor: "pointer",
                    }}
                ></div>
            </Swiper>
        </div>
    );
}
