import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import { useStateContext } from "../context/ContextProvider";
import Switch from "./Switch";

export default function ProductosCardAdmin({ category }) {
    const { fetchProductos, productos } = useStateContext();

    const [imagen, setImagen] = useState();
    const [nombre, setNombre] = useState(category?.name);
    const [orden, setOrden] = useState(category?.orden);
    const [edit, setEdit] = useState(false);

    const [plano, setPlano] = useState();

    const hanldeFileChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const update = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (imagen) {
            formData.append("image", imagen);
        }
        formData.append("name", nombre ? nombre : " ");
        if (orden) formData.append("orden", orden);
        if (plano) formData.append("plano", plano);

        const response = adminAxiosClient.post(
            `/productos/${category?.id}?_method=PUT`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        toast.promise(response, {
            loading: "Actualizando...",
            success: "Actualizado correctamente",
            error: "Error al actualizar",
        });

        try {
            await response;
            console.log(response);
            fetchProductos();
            setEdit(false);
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const deleteCategory = async () => {
        // Show confirmation toast
        toast(
            (t) => (
                <div className="flex flex-col space-y-2">
                    <p>¿Estás seguro de que deseas eliminar este producto?</p>
                    <div className="flex justify-between space-x-2">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                confirmDelete();
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                position: "top-center",
            }
        );

        const confirmDelete = async () => {
            const response = adminAxiosClient.delete(
                `/productos/${category?.id}`
            );

            toast.promise(response, {
                loading: "Eliminando...",
                success: "Eliminado correctamente",
                error: "Error al eliminar",
            });

            try {
                await response;

                fetchProductos(true);
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        };
    };

    return (
        <tr className={`border text-black odd:bg-gray-100 even:bg-white`}>
            <td className=" align-middle">{orden}</td>
            <td className=" align-middle pl-3">{nombre}</td>
            <td className=" align-middle pl-3">{category?.categoria}</td>
            <td className=" align-middle pl-3">{category?.subCategoria}</td>

            <td className=" w-[90px] h-[90px] px-8">
                {category?.image ? (
                    <img
                        className="w-full h-full object-contain"
                        src={category?.image}
                        alt=""
                    />
                ) : (
                    <p>Sin Imagen</p>
                )}
            </td>

            <td className=" w-[90px] h-[90px] px-8">
                {category?.plano ? (
                    <img
                        className="w-full h-full object-contain"
                        src={category?.plano}
                        alt=""
                    />
                ) : (
                    <p>Sin Detalle</p>
                )}
            </td>

            <td className="h-[80px] flex justify-center items-center text-center align-middle">
                <Switch
                    id={category?.id}
                    path={"/productos"}
                    initialEnabled={category?.featured == 1 ? true : false}
                />
            </td>

            <td className="text-center w-[140px]">
                <div className="flex flex-row gap-3 justify-center">
                    <button
                        onClick={() => setEdit(true)}
                        className="border-blue-500 border py-1 px-2 text-white rounded-md w-10 h-10"
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            size="lg"
                            color="#3b82f6"
                        />
                    </button>
                    <button
                        onClick={deleteCategory}
                        className="border-red-500 border py-1 px-2 text-white rounded-md w-10 h-10"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            size="lg"
                            color="#fb2c36"
                        />
                    </button>
                </div>
            </td>
            <AnimatePresence>
                {edit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 text-left"
                    >
                        <form onSubmit={update} className="text-black">
                            <div className="bg-white p-4 w-[500px] rounded-md">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Editar categoria
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="imagen">Imagen</label>
                                    <span className="text-base font-normal">
                                        Resolucion recomendada: 269x271px
                                    </span>
                                    <div className="flex flex-row">
                                        <input
                                            type="file"
                                            name="imagen"
                                            id="imagenedit"
                                            onChange={hanldeFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            className="cursor-pointer border border-primary-orange rounded-md text-primary-orange hover:bg-primary-orange hover:text-white transition duration-300 py-1 px-2"
                                            htmlFor="imagenedit"
                                        >
                                            Elegir imagen
                                        </label>
                                        <p>{imagen?.name}</p>
                                    </div>
                                    <label htmlFor="plano">
                                        DETALLE TÉCNICO
                                    </label>
                                    <div className="flex flex-row">
                                        <input
                                            type="file"
                                            name="imagen"
                                            id="plano"
                                            onChange={(e) =>
                                                setPlano(e.target.files[0])
                                            }
                                            className="hidden"
                                        />
                                        <label
                                            className="cursor-pointer border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                            htmlFor="plano"
                                        >
                                            Elegir imagen
                                        </label>
                                        <p className="self-center px-2">
                                            {plano?.name}
                                        </p>
                                    </div>
                                    <label htmlFor="nombre">
                                        Nombre{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        value={nombre}
                                        onChange={(e) =>
                                            setNombre(e.target.value)
                                        }
                                    />

                                    <label htmlFor="ordenn">Orden</label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="ordenn"
                                        id="ordenn"
                                        value={orden}
                                        onChange={(e) =>
                                            setOrden(e.target.value)
                                        }
                                    />

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setEdit(false)}
                                            className="border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </tr>
    );
}
