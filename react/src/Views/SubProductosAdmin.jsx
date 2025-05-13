import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import adminAxiosClient from "../adminAxiosClient";
import ProductosCardAdmin from "../components/ProductosCardAdmin";
import SubProductosCardAdmin from "../Components/SubProductosCardAdmin";
import { useStateContext } from "../context/ContextProvider";

export default function SubProductosAdmin() {
    const { productos, subProductos, fetchSubProductos, subLoading } =
        useStateContext();
    const [createView, setCreateView] = useState(false);

    const [submitInfo, setSubmitInfo] = useState({
        orden: "",
        code: "",
        producto_id: "",
        min: "",
        precio_de_lista: "",
        min_oferta: "",
        precio_de_oferta: "",
        bulto_cerrado: "",
        image: "",
        descuento: "",
    });
    const [feature, setFeature] = useState(false);
    const [categoriaId, setCategoriaId] = useState();
    const [subCategoriaId, setSubCategoriaId] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermCode, setSearchTermCode] = useState("");
    const [archivo, setArchivo] = useState();
    const [precioView, setPrecioView] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSubProductos();
    }, []);

    const handleSubirArchivo = async () => {
        const formData = new FormData();
        formData.append("excel", archivo);

        const respuesta = adminAxiosClient.post("/upload-excel", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        toast.promise(respuesta, {
            loading: "Subiendo archivo...",
            success: "Archivo subido correctamente",
            error: "Error al subir el archivo",
        });

        try {
            await respuesta;
            setPrecioView(false);
        } catch (error) {
            console.log(error);
        }
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

        const reposnse = adminAxiosClient.post("/sub-productos", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        toast.promise(reposnse, {
            loading: "Guardando...",
            success: "Guardado correctamente",
            error: "Error al guardar",
        });

        try {
            await reposnse;
            fetchSubProductos(true);
            setCreateView(false);
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    // Filtrar categorías por búsqueda
    const filteredCategorias = subProductos
        ?.filter((category) => {
            // Si no hay términos de búsqueda, mostrar todos los elementos
            if (!searchTerm && !searchTermCode) return true;

            // Verificar si el nombre o el código son null o undefined
            const nameIsNull =
                category?.name === null || category?.name === undefined;
            const codeIsNull =
                category?.code === null || category?.code === undefined;

            // Filtrar por nombre si `searchTerm` está presente
            const matchesName = searchTerm
                ? nameIsNull ||
                  category.name.toLowerCase().includes(searchTerm.toLowerCase())
                : true;

            // Filtrar por código si `searchTermCode` está presente
            const matchesCode = searchTermCode
                ? codeIsNull ||
                  category.code
                      .toLowerCase()
                      .includes(searchTermCode.toLowerCase())
                : true;

            // Incluir elementos que coincidan con ambos filtros
            return matchesName && matchesCode;
        })
        ?.slice() // Evita mutar el estado original
        ?.sort((a, b) => {
            // Verificar si alguno de los valores es null o undefined
            const aOrdenIsNull = a?.orden === null || a?.orden === undefined;
            const bOrdenIsNull = b?.orden === null || b?.orden === undefined;

            // Si ambos son null/undefined, no importa el orden entre ellos
            if (aOrdenIsNull && bOrdenIsNull) return 0;

            // Si solo a es null/undefined, va después de b
            if (aOrdenIsNull) return 1;

            // Si solo b es null/undefined, va después de a
            if (bOrdenIsNull) return -1;

            // Si ambos son números, ordenar numéricamente
            if (!isNaN(Number(a.orden)) && !isNaN(Number(b.orden))) {
                return Number(a.orden) - Number(b.orden);
            }

            // Orden alfabético como fallback
            return String(a.orden).localeCompare(String(b.orden), undefined, {
                numeric: true,
            });
        });

    // Calcular los datos a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategorias?.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math?.ceil(filteredCategorias?.length / itemsPerPage);

    return (
        <div className="flex flex-col w-full p-6">
            <Toaster />
            <AnimatePresence>
                {precioView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 text-left"
                    >
                        <form
                            onSubmit={handleSubirArchivo}
                            method="POST"
                            className="text-black"
                        >
                            <div className="bg-white p-4 w-[500px] rounded-md">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Actualziar precio con Excel
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="imagenn">Archivo</label>
                                    <div className="flex flex-row">
                                        <input
                                            type="file"
                                            name="imagen"
                                            id="imagenn"
                                            onChange={(e) =>
                                                setArchivo(e.target.files[0])
                                            }
                                            className="hidden"
                                        />
                                        <label
                                            className="cursor-pointer border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                            htmlFor="imagenn"
                                        >
                                            Elegir Archivo
                                        </label>
                                        <p className="self-center px-2">
                                            {archivo?.name}
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPrecioView(false)}
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
            <AnimatePresence>
                {createView && (
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
                                    Crear producto
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
                                        <option selected disabled value="">
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
                                    <span className="text-base font-normal">
                                        Resolucion recomendada: 269x271px
                                    </span>
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
                                            onClick={() => setCreateView(false)}
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
            <div className="flex flex-col w-full  mx-auto gap-3">
                <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                    Sub-Productos
                </h2>
                <div className="w-full flex h-fit flex-row gap-5">
                    <input
                        type="text"
                        placeholder="Buscar sub-producto por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 border border-gray-300 rounded-md w-full"
                    />
                    <input
                        type="text"
                        placeholder="Buscar sub-producto por codigo..."
                        value={searchTermCode}
                        onChange={(e) => setSearchTermCode(e.target.value)}
                        className="px-3 border border-gray-300 rounded-md w-full"
                    />
                    <button
                        onClick={() => setCreateView(true)}
                        className="bg-primary-orange hover:bg-orange-400 w-[400px] text-white font-bold py-1 px-4 rounded"
                    >
                        Crear producto
                    </button>
                    <button
                        onClick={() => setPrecioView(true)}
                        className="bg-primary-orange hover:bg-orange-400 w-[400px] text-white font-bold py-1 px-4 rounded"
                    >
                        Actualizar precios
                    </button>
                </div>

                <div className="flex justify-center w-full">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border">
                        <thead className="text-sm font-medium text-black bg-gray-300 uppercase">
                            <tr>
                                <td className="text-center">ORDEN</td>
                                <td className="text-center">CODIGO</td>
                                <td className="text-center ">
                                    PRODUCTO ASOCIADO
                                </td>
                                <td className="text-center ">
                                    MINIMO DE VENTA
                                </td>
                                <td className="text-center ">
                                    PRECIO DE LISTA
                                </td>
                                <td className="text-center ">
                                    MINIMO DE VENTA {"(OFERTA)"}
                                </td>
                                <td className="text-center ">
                                    PRECIO DE OFERTA
                                </td>
                                <td className="text-center ">BULTO CERRADO</td>
                                <td className="py-2 px-3 text-center">
                                    IMAGEN
                                </td>
                                <td className="text-center ">DESCUENTO</td>
                                <td className="text-center ">STOCK</td>
                                <td className="text-center">EDITAR</td>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentItems?.map((category) => (
                                <SubProductosCardAdmin
                                    key={category.id}
                                    category={category}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Paginación */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded-l-md disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 bg-gray-200">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded-r-md disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
