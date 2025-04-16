import React from "react";
import { toast } from "react-hot-toast";
import facturaIcon from "../assets/icons/facturaLogo.png";
import axiosClient from "../axios";

export default function MiFacturaRow({ facturaObject }) {
    const downloadFile = async () => {
        const filename = facturaObject?.factura?.split("/").pop(); // Extraer el nombre del archivo

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
        <tr>
            <td className="w-[80px] h-[80px] bg-[#F5F5F5] rounded-md align-middle flex justify-center items-center">
                <img src={facturaIcon} className="" alt="" />
            </td>
            <td>{facturaObject?.created_at}</td>
            <td>{facturaObject?.pedidoId}</td>
            <td>{facturaObject?.num_factura}</td>
            <td>
                $
                {Number(facturaObject?.importe)?.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </td>
            <td className="text-center">
                <button
                    onClick={downloadFile}
                    className="text-bold bg-primary-orange text-white w-[145px] h-[51px] rounded-full hover:bg-transparent hover:text-primary-orange hover:border hover:border-primary-orange transition duration-300"
                >
                    Descargar
                </button>
            </td>
        </tr>
    );
}
