import React from "react";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function Catalogo() {
    const { catalogo } = useStateContext();

    const handleDownload = async () => {
        try {
            const filename = catalogo?.file.split("/").pop();
            // Make a GET request to the download endpoint
            const response = await axiosClient.get(
                `/catalogo/download/${filename}`,
                {
                    responseType: "blob", // Important for file downloads
                }
            );

            // Create a link element to trigger the download
            const fileType =
                response.headers["content-type"] || "application/octet-stream";
            const blob = new Blob([response.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "Catalogo"; // Descargar con el nombre original
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);

            // Optional: show user-friendly error message
            alert("Failed to download the file. Please try again.");
        }
    };

    return (
        <div className="h-[515px] max-sm:h-auto max-sm:py-12 w-full bg-white">
            <div className="w-[1200px] max-sm:w-full max-sm:px-4 mx-auto h-full">
                <div className="flex flex-row max-sm:flex-col h-full">
                    <div className="w-full flex justify-center items-center max-sm:mb-8">
                        <img
                            src={catalogo?.image}
                            className="w-[500px] h-[355px] max-sm:w-full max-sm:h-auto max-sm:object-contain"
                            alt=""
                        />
                    </div>
                    <div className="w-full flex justify-start items-center max-sm:justify-center">
                        <div className="flex flex-col gap-11 max-sm:gap-6 max-sm:items-center">
                            <div
                                className="prose prose-headings:font-normal prose-strong:font-bold max-sm:text-center"
                                dangerouslySetInnerHTML={{
                                    __html: catalogo?.title,
                                }}
                            />
                            <button
                                onClick={handleDownload}
                                className="text-sm h-[52px] w-[214px] font-bold rounded-full text-white bg-primary-orange"
                            >
                                DESCARGAR CATÁLOGO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
