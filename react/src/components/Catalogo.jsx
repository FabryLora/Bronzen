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
        <div className="h-[515px] w-full bg-white">
            <div className="w-[1200px] mx-auto h-full">
                <div className="flex flex-row h-full">
                    <div className="w-full flex justify-center items-center">
                        <img
                            src={catalogo?.image}
                            className="w-[500px] h-[355px]"
                            alt=""
                        />
                    </div>
                    <div className="w-full flex justify-start items-center">
                        <div className="flex flex-col gap-11">
                            <div
                                className="prose prose-headings:font-normal prose-strong:font-bold"
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
