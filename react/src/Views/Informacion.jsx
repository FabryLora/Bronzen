import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import AdminButton from "../Components/AdminButton";
import CustomReactQuill from "../components/CustomReactQuill";
import { useStateContext } from "../context/ContextProvider";

export default function Informacion() {
    const { informacion, fetchInformacion } = useStateContext();

    useEffect(() => {
        fetchInformacion();
    }, []);

    const [infoImportante, setInfoImportante] = useState(
        informacion?.informacion
    );
    const [descuentoReparto, setDescuentoReparto] = useState(
        informacion?.descuento_reparto
    );

    useEffect(() => {
        setInfoImportante(informacion?.informacion);
        setDescuentoReparto(informacion?.descuento_reparto);
    }, [informacion]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("informacion", infoImportante);
        formData.append("descuento_reparto", descuentoReparto);

        const response = adminAxiosClient.post(
            "/informacion/1?_method=PUT",
            formData
        );

        toast.promise(response, {
            loading: "Guardando cambios...",
            success: "Cambios guardados",
            error: "Error al guardar los cambios",
        });

        try {
            await response;
            fetchInformacion();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-6 flex flex-col gap-5">
            <Toaster />
            <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                Informacion y Descuento
            </h2>

            <style>
                {`
                .ql-container {
                    background-color: white;
                }
                `}
            </style>
            <form
                onSubmit={onSubmit}
                method="POST"
                className="flex flex-col gap-15"
            >
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-medium">
                        Informacion importante
                    </p>
                    <CustomReactQuill
                        value={infoImportante}
                        onChange={setInfoImportante}
                    />
                </div>
                <div className="">
                    <div className="w-full">
                        <label
                            htmlFor="title"
                            className="flex flex-row gap-2 items-center text-sm/6 font-medium text-gray-900"
                        >
                            <p className="text-lg font-medium">
                                Descuento de retiro
                            </p>
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-orange">
                                <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                <input
                                    value={descuentoReparto}
                                    onChange={(ev) => {
                                        setDescuentoReparto(ev.target.value);
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
                <div>
                    <AdminButton text={"Actualizar"} />
                </div>
            </form>
        </div>
    );
}
