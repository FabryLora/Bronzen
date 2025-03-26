import React from "react";
import ImageSlider from "./ImageSlider";

export default function NovedadesInicio() {
    return (
        <div className="h-[560px]">
            <div className="max-w-[1200px] mx-auto h-full flex flex-row">
                <div className="w-1/2 h-full ">
                    <ImageSlider />
                </div>
                <div className="w-1/2 h-full flex flex-col gap-10 justify-center items-end">
                    <div className="flex flex-col gap-3 text-primary-gray">
                        <h2 className=" text-6xl font-bold">NOVEDADES</h2>
                        <p className="italic text-2xl font-medium text-right">
                            MARZO 2025
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
