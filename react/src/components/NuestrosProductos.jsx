import React from "react";
import LineaComponent from "./LineaComponent";

export default function NuestrosProductos() {
    const lineaArray = [{ title: "ALUMINIO", subtitle: "LINEA" }];

    return (
        <div className="min-h-[1043px] bg-[#5b6771]">
            <div className="w-[1200px] mx-auto py-20 px-3 flex flex-col gap-7">
                <h2 className="text-white font-bold text-5xl">
                    NUESTRO PRODUCTOS
                </h2>
                <div className="grid grid-cols-2">
                    <LineaComponent />
                </div>
            </div>
        </div>
    );
}
