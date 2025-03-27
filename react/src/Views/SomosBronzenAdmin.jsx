import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import adminAxiosClient from "../adminAxiosClient";
import AdminButton from "../Components/AdminButton";

import { useStateContext } from "../context/ContextProvider";

export default function SomosBronzenAdmin() {
    const { somosBronzenInicio, fetchSomosBronzenInicio } = useStateContext();

    useEffect(() => {
        fetchSomosBronzenInicio();
    }, []);

    const [title, setTitle] = useState(somosBronzenInicio?.title);
    const [text, setText] = useState(somosBronzenInicio?.text);
    const [image, setImage] = useState();

    useEffect(() => {
        setTitle(somosBronzenInicio?.title);
        setText(somosBronzenInicio?.text);
    }, [somosBronzenInicio]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("text", text);
        if (image) formData.append("image", image);

        const response = adminAxiosClient.post(
            "/somos-bronzen-inicio/1?_method=PUT",
            formData
        );

        toast.promise(response, {
            loading: "Guardando cambios...",
            success: "Cambios guardados",
            error: "Error al guardar los cambios",
        });

        try {
            await response;
            fetchSomosBronzenInicio();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Toaster />
            <form onSubmit={onSubmit} className="p-6 " method="POST">
                <div className=" flex flex-col gap-6 pb-10">
                    <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                        Somos bronzen
                    </h2>
                    <div className="flex flex-row w-full gap-2">
                        <div className="w-full">
                            <label
                                htmlFor="title"
                                className="flex flex-row gap-2 items-center text-sm/6 font-medium text-gray-900"
                            >
                                <p className="text-lg">Titulo</p>
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-orange">
                                    <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                    <input
                                        value={title}
                                        onChange={(ev) => {
                                            setTitle(ev.target.value);
                                        }}
                                        id="title"
                                        name="title"
                                        type="text"
                                        className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <style>
                        {`
                .ql-container {
                    background-color: white;
                }
                `}
                    </style>
                    <div className="flex flex-col gap-2">
                        <p className="text-lg">Texto</p>
                        <ReactQuill
                            className="bg-white"
                            theme="snow"
                            value={text}
                            onChange={setText}
                        />
                    </div>
                    <div className="w-full col-span-2 ">
                        <label
                            htmlFor="logoprincipal"
                            className="block text-lg font-medium"
                        >
                            Imagen:
                        </label>
                        <div className="mt-2 flex justify-between rounded-lg border border-gray-300 shadow-lg  ">
                            <div className=" w-2/3 h-[200px] bg-[rgba(0,0,0,0.2)]">
                                <img
                                    className="w-full h-full object-cover rounded-md"
                                    src={somosBronzenInicio?.image}
                                    alt=""
                                />
                            </div>
                            <div className="flex items-center justify-center w-1/3">
                                <div className="text-center items-center h-fit self-center">
                                    <div className="relative items-center mt-4 flex flex-col text-sm/6 text-gray-600">
                                        <label
                                            htmlFor="image"
                                            className="relative cursor-pointer rounded-md  font-semibold bg-primary-red  text-black py-1 px-2"
                                        >
                                            <span>Cambiar Imagen</span>
                                            <input
                                                id="image"
                                                name="image"
                                                onChange={(e) =>
                                                    setImage(e.target.files[0])
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
                </div>

                <AdminButton text={"Actualizar"} />
            </form>
        </>
    );
}
