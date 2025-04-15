import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import { useStateContext } from "../context/ContextProvider";
import Switch from "./Switch";

export default function SubProductosCardAdmin({ category }) {
    const { fetchProductos, productos, fetchSubProductos } = useStateContext();

    const [imagen, setImagen] = useState();
    const [nombre, setNombre] = useState(category?.name);
    const [orden, setOrden] = useState(category?.orden);
    const [edit, setEdit] = useState(false);
    const [featured, setFeatured] = useState(false);

    const [submitInfo, setSubmitInfo] = useState({
        orden: category?.orden,
        code: category?.code,
        producto_id: category?.productoId,
        min: category?.min,
        precio_de_lista: category?.precio_de_lista,
        min_oferta: category?.min_oferta,
        precio_de_oferta: category?.precio_de_oferta,
        bulto_cerrado: category?.bulto_cerrado,
        image: "",
        descuento: category?.descuento,
    });

    useEffect(() => {
        setSubmitInfo({
            orden: category?.orden,
            code: category?.code,
            name: category?.name,
            producto_id: category?.productoId,
            min: category?.min,
            precio_de_lista: category?.precio_de_lista,
            min_oferta: category?.min_oferta,
            precio_de_oferta: category?.precio_de_oferta,
            bulto_cerrado: category?.bulto_cerrado,
            image: "",
            descuento: category?.descuento,
        });

        setNombre(category?.name);
        setOrden(category?.orden);
    }, [category]);

    const hanldeFileChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (submitInfo?.orden) formData.append("orden", submitInfo?.orden);
        formData.append("name", submitInfo?.name);
        formData.append("code", submitInfo?.code);
        formData.append("producto_id", submitInfo?.producto_id);
        formData.append("min", submitInfo?.min);
        formData.append("precio_de_lista", submitInfo?.precio_de_lista);
        if (submitInfo?.min_oferta)
            formData.append("min_oferta", submitInfo?.min_oferta);
        if (submitInfo?.precio_de_oferta)
            formData.append("precio_de_oferta", submitInfo?.precio_de_oferta);
        formData.append("bulto_cerrado", submitInfo?.bulto_cerrado);
        if (submitInfo?.image) formData.append("image", submitInfo?.image);
        if (submitInfo?.descuento)
            formData.append("descuento", submitInfo?.descuento);
        formData.append("stock", 1);

        const reposnse = adminAxiosClient.post(
            `/sub-productos/${category?.id}?_method=PUT`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        toast.promise(reposnse, {
            loading: "Guardando...",
            success: "Guardado correctamente",
            error: "Error al guardar",
        });

        try {
            await reposnse;
            fetchSubProductos();
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
            <td className=" align-middle pl-3">{category?.code}</td>
            <td className=" align-middle pl-3">{category?.producto}</td>
            <td className=" align-middle pl-3">{category?.min}</td>
            <td className=" align-middle pl-3">
                ${" "}
                {Number(category?.precio_de_lista)?.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </td>
            <td className=" align-middle pl-3">{category?.min_oferta}</td>
            <td className=" align-middle pl-3">
                {category?.precio_de_oferta
                    ? `$ ${Number(category?.precio_de_oferta)?.toLocaleString(
                          "es-AR",
                          {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                          }
                      )}`
                    : "Sin oferta"}
            </td>
            <td className=" align-middle pl-3">{category?.bulto_cerrado}</td>

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
            <td
                className={
                    Number(category?.descuento > 0)
                        ? "text-green-500"
                        : "text-gray-500"
                }
            >
                {category?.descuento}%
            </td>
            <td>
                <Switch
                    id={category?.id}
                    path={"/sub-productos"}
                    initialEnabled={category?.stock === 1 ? true : false}
                />
            </td>

            {/* <td className="h-[80px] flex justify-center items-center text-center align-middle">
                <Switch
                    id={category?.id}
                    path={"/productos"}
                    enabled={featured}
                    onChange={setFeatured}
                />
            </td> */}

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
                        <form
                            onSubmit={submit}
                            method="POST"
                            className="text-black max-h-[95vh] overflow-y-auto scrollbar-hidden"
                        >
                            <div className="bg-white p-4 w-[500px] rounded-md">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Actualizar producto
                                </h2>

                                <div className="flex flex-col gap-4">
                                    <label htmlFor="Orden">Orden </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="Orden"
                                        id="Orden"
                                        value={submitInfo?.orden}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                orden: e.target.value,
                                            })
                                        }
                                    />
                                    <label htmlFor="name">Nombre </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={submitInfo?.name}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <label htmlFor="codigo">
                                        Codigo{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="codigo"
                                        id="codigo"
                                        value={submitInfo?.code}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                code: e.target.value,
                                            })
                                        }
                                    />

                                    <label htmlFor="Producto">
                                        Producto asociado{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="Producto"
                                        id="Producto"
                                        value={submitInfo?.producto_id}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                producto_id: e.target.value,
                                            })
                                        }
                                    >
                                        <option disabled value="">
                                            Seleccionar producto
                                        </option>
                                        {productos?.map((category) => (
                                            <option
                                                key={category?.id}
                                                value={category?.id}
                                            >
                                                {category?.name}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="Minimo de venta">
                                        Minimo de venta{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="Minimo de venta"
                                        id="Minimo de venta"
                                        value={submitInfo?.min}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                min: e.target.value,
                                            })
                                        }
                                    />

                                    <label htmlFor="Precio de lista">
                                        Precio de lista{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="Precio de lista"
                                        id="Precio de lista"
                                        value={submitInfo?.precio_de_lista}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                precio_de_lista: e.target.value,
                                            })
                                        }
                                    />

                                    <label htmlFor="Minimo de venta (oferta)">
                                        Minimo de venta {"(oferta)"}{" "}
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="Minimo de venta (oferta)"
                                        id="Minimo de venta (oferta)"
                                        value={submitInfo?.min_oferta}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                min_oferta: e.target.value,
                                            })
                                        }
                                    />

                                    <label htmlFor="Precio de oferta">
                                        Precio de oferta{" "}
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="Precio de oferta"
                                        id="Precio de oferta"
                                        value={submitInfo?.precio_de_oferta}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                precio_de_oferta:
                                                    e.target.value,
                                            })
                                        }
                                    />

                                    <label htmlFor="Bulto cerrado">
                                        Bulto cerrado{" "}
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="Bulto cerrado"
                                        id="Bulto cerrado"
                                        value={submitInfo?.bulto_cerrado}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                bulto_cerrado: e.target.value,
                                            })
                                        }
                                    />

                                    <label htmlFor="Imagen">
                                        Imagen{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="outline file:rounded-full file:bg-primary-orange file:text-white file:font-bold file:p-2 file:cursor-pointer outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="file"
                                        name="Imagen"
                                        id="Imagen"
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                image: e.target.files[0],
                                            })
                                        }
                                    />

                                    <label htmlFor="Descuento">
                                        Descuento{" "}
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="Descuento"
                                        id="Descuento"
                                        value={submitInfo?.descuento}
                                        onChange={(e) =>
                                            setSubmitInfo({
                                                ...submitInfo,
                                                descuento: e.target.value,
                                            })
                                        }
                                    />

                                    <div className="sticky bottom-0 py-4 bg-white flex justify-end gap-4">
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
