import React from "react";
import toast from "react-hot-toast";
import logoPedido from "../assets/icons/facturaLogo.png";
import axiosClient from "../axios";

export default function MisFacturasRow({ factura }) {
    const downloadFile = async () => {
        const filename = factura?.factura?.split("/").pop(); // Extraer el nombre del archivo

        try {
            // Esperar a que se complete la solicitud
            const response = await axiosClient.get(
                `/descargar-archivo/${filename}`,
                {
                    responseType: "blob",
                }
            );

            // Mostrar toast después de tener la respuesta
            toast.success("Descargado correctamente");

            // Obtener el tipo de archivo dinámicamente desde la respuesta
            const fileType =
                response.headers["content-type"] || "application/octet-stream";
            const blob = new Blob([response.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename; // Descargar con el nombre original
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a); // Buena práctica: eliminar el elemento después de usarlo
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
            toast.error("Error al descargar");
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center px-4 gap-4 border-b border-[#EAEAEA] py-4">
            <div className="flex flex-row w-full gap-6">
                <div className="flex items-center justify-center bg-[#F5F5F5] h-[95px] w-[95px] rounded-md">
                    <img src={logoPedido} alt="" />
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-x-4">
                    <div className="flex flex-col">
                        <p className="font-bold text-xs">Fecha</p>
                        <p className="text-xs">
                            {factura?.created_at
                                ?.split("T")[0]
                                ?.split("-")
                                ?.reverse()
                                ?.join("/")}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold text-xs">Nº de pedido</p>
                        <p className="text-xs">{factura?.pedidoId}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold text-xs">Nº de factura</p>
                        <p className="text-xs">{factura?.num_factura}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold text-xs">Importe</p>
                        <p className="text-xs">
                            ${" "}
                            {Number(factura?.importe)?.toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={downloadFile}
                className="w-full rounded-full font-bold text-white bg-primary-orange h-[40px] "
            >
                Descargar
            </button>
        </div>
    );
}
