import React from "react";
import ImageSlider from "./ImageSlider";

export default function NovedadesInicio() {
    const date = new Date();
    const month = date.toLocaleString("es-AR", { month: "long" });
    const year = date.getFullYear();

    return (
        <div className="h-[560px] max-sm:h-auto">
            <div className="max-w-[1200px] mx-auto h-full flex flex-row max-sm:flex-col max-sm:w-full">
                <div className="w-1/2 h-full max-sm:w-full max-sm:h-[350px]">
                    <ImageSlider />
                </div>
                <div className="w-1/2 h-full flex flex-col gap-10 justify-center items-end max-sm:w-full max-sm:items-center max-sm:py-8 max-sm:gap-6">
                    <div className="flex flex-col gap-3 text-primary-gray max-sm:items-center">
                        <h2 className="text-6xl font-bold max-sm:text-4xl">
                            NOVEDADES
                        </h2>
                        <p className="italic text-2xl font-medium text-right max-sm:text-xl max-sm:text-center uppercase">
                            {month.charAt(0).toUpperCase() + month.slice(1)}{" "}
                            {year}
                        </p>
                    </div>
                    <button className="bg-primary-orange font-bold text-white h-[52px] w-[169px] rounded-full text-sm">
                        VER NOVEDADES
                    </button>
                </div>
            </div>
        </div>
    );
}
