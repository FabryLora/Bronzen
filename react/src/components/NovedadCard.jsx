import React from "react";
import { Link } from "react-router-dom";

export default function NovedadCard({ prod }) {
    return (
        <Link
            to={`/productos/${prod?.categoriaId}/${prod?.subCategoriaId}/${prod?.id}`}
            className="w-[277px] px-3.5 bg-white rounded-2xl gap-2 h-[358px] flex flex-col pb-2"
        >
            <div className="w-[247px] min-h-[271px] border-b-[3px] border-primary-orange">
                <img
                    className="w-full h-full object-cover"
                    src={prod?.image}
                    alt=""
                />
            </div>
            <div className="flex flex-col justify-between h-full py-1">
                <h2 className="text-[16px] text-[#5B6670] font-bold">
                    {prod?.name}
                </h2>
                <div className="flex flex-row text-xs items-center gap-1 ">
                    <Link
                        to={`/productos/${prod?.categoriaId}`}
                        className="text-[#c96]"
                    >
                        Linea {prod?.categoria?.toLowerCase()}
                    </Link>
                    <p className="text-gray-500">{" > "}</p>
                    <Link
                        to={`/productos/${prod?.categoriaId}/${prod?.subCategoriaId}`}
                        className="text-[#c96]"
                    >
                        {prod?.subCategoria?.toLowerCase()}
                    </Link>
                </div>
            </div>
        </Link>
    );
}
