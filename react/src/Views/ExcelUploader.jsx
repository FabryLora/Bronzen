import axios from "axios";
import React, { useState } from "react";
import adminAxiosClient from "../adminAxiosClient";

const ExcelUploader = () => {
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [progreso, setProgreso] = useState(0);
    const [cargando, setCargando] = useState(false);

    const handleArchivoSeleccionado = (event) => {
        const archivoSeleccionado = event.target.files[0];
        setArchivo(archivoSeleccionado);
    };

    const handleSubirArchivo = async () => {
        if (!archivo) {
            setMensaje("Por favor, selecciona un archivo");
            return;
        }

        const formData = new FormData();
        formData.append("excel", archivo);

        setCargando(true);
        setMensaje("");

        try {
            const respuesta = await adminAxiosClient.post(
                "/upload-excel",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const porcentajeCompletado = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgreso(porcentajeCompletado);
                    },
                }
            );

            setMensaje(respuesta.data.message);
            setProgreso(100);
        } catch (error) {
            setMensaje(
                "Error al subir el archivo: " +
                    (error.response?.data?.message || error.message)
            );
            setProgreso(0);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl mb-4 text-center">
                Cargar Productos desde Excel
            </h2>

            <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleArchivoSeleccionado}
                className="w-full mb-4 p-2 border rounded"
            />

            {archivo && (
                <div className="mb-4 text-sm text-gray-600">
                    Archivo seleccionado: {archivo.name}
                </div>
            )}

            {progreso > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progreso}%` }}
                    ></div>
                </div>
            )}

            <button
                onClick={handleSubirArchivo}
                disabled={cargando}
                className={`w-full py-2 rounded ${
                    cargando
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
                {cargando ? "Subiendo..." : "Subir Archivo"}
            </button>

            {mensaje && (
                <div
                    className={`mt-4 p-3 rounded ${
                        mensaje.includes("Error")
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default ExcelUploader;
