import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import adminAxiosClient from "../adminAxiosClient";
import AdminButton from "../Components/AdminButton";

import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function CatalogoAdmin() {
    const { catalogo, fetchCatalogo } = useStateContext();

    useEffect(() => {
        fetchCatalogo();
    }, []);

    const [title, setTitle] = useState(catalogo?.title);
    const [file, setFile] = useState();
    const [image, setImage] = useState();

    useEffect(() => {
        setTitle(catalogo?.title);
    }, [catalogo]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        if (file) formData.append("file", file);
        if (image) formData.append("image", image);

        const response = adminAxiosClient.post(
            "/catalogo/1?_method=PUT",
            formData
        );

        toast.promise(response, {
            loading: "Guardando cambios...",
            success: "Cambios guardados",
            error: "Error al guardar los cambios",
        });

        try {
            await response;
            fetchCatalogo();
        } catch (error) {
            console.log(error);
        }
    };

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
            toast.success("Archivo descargado correctamente");
        } catch (error) {
            console.error("Download failed:", error);

            // Optional: show user-friendly error message
            alert("Failed to download the file. Please try again.");
        }
    };

    return (
        <>
            <Toaster />
            <form onSubmit={onSubmit} className="p-6 " method="POST">
                <div className=" flex flex-col gap-6 pb-10">
                    <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                        Catalogo
                    </h2>

                    <style>
                        {`
                .ql-container {
                    background-color: white;
                }
                `}
                    </style>
                    <div className="flex flex-col gap-2">
                        <p className="text-lg">Titulo</p>
                        <ReactQuill
                            className="bg-white"
                            theme="snow"
                            value={title}
                            onChange={setTitle}
                        />
                    </div>

                    <div className="flex flex-row gap-2">
                        <div className="w-full col-span-2 ">
                            <label
                                htmlFor="logoprincipal"
                                className="block text-lg font-medium"
                            >
                                Imagen:
                            </label>
                            <div className="mt-2 flex justify-between rounded-lg border border-gray-300 shadow-lg  ">
                                <div className=" w-1/2 h-[200px] bg-[rgba(0,0,0,0.2)]">
                                    <img
                                        className="w-full h-full object-cover rounded-md"
                                        src={catalogo?.image}
                                        alt=""
                                    />
                                </div>
                                <div className="flex items-center justify-center w-1/2">
                                    <div className="text-center items-center h-fit self-center">
                                        <div className="relative items-center flex flex-col text-sm/6 text-gray-600">
                                            <label
                                                htmlFor="image"
                                                className="relative cursor-pointer border rounded-full font-semibold bg-primary-red  text-primary-gray py-2 px-4 hover:text-white hover:bg-primary-gray transition duration-300"
                                            >
                                                Cambiar Imagen
                                                <input
                                                    id="image"
                                                    name="image"
                                                    onChange={(e) =>
                                                        setImage(
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    type="file"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="absolute top-10 break-words max-w-[200px]">
                                                {" "}
                                                {image?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full col-span-2 ">
                            <label
                                htmlFor="logoprincipal"
                                className="block text-lg font-medium"
                            >
                                Archivo:
                            </label>
                            <div className="mt-2 flex justify-between rounded-lg border border-gray-300 shadow-lg  ">
                                <div className=" w-1/2 h-[200px] flex justify-center items-center">
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        className="border border-primary-orange text-primary-orange hover:text-white hover:bg-primary-orange transition duration-300 px-4 py-2 rounded-full"
                                    >
                                        Descragar Archivo
                                    </button>
                                </div>
                                <div className="flex items-center justify-center w-1/2">
                                    <div className="text-center items-center h-fit self-center">
                                        <div className="relative flex flex-col text-sm/6 text-gray-600 justify-center items-center">
                                            <label
                                                htmlFor="file"
                                                className="relative cursor-pointer border rounded-full font-semibold bg-primary-red  text-primary-gray py-2 px-4 hover:text-white hover:bg-primary-gray transition duration-300"
                                            >
                                                Cambiar Archivo
                                                <input
                                                    id="file"
                                                    name="file"
                                                    onChange={(e) =>
                                                        setFile(
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    type="file"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="absolute top-10 break-words max-w-[200px]">
                                                {" "}
                                                {file?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AdminButton text={"Actualizar"} />
            </form>
        </>
    );
}
