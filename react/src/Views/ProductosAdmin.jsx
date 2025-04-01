import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import CategoryAdminCard from "../components/CategoryAdminCard";
import ProductosCardAdmin from "../components/ProductosCardAdmin";
import { useStateContext } from "../context/ContextProvider";

export default function ProductosAdmin() {
    const { productos, fetchProductos, categorias, subCategorias } =
        useStateContext();
    const [createView, setCreateView] = useState(false);

    const [imagen, setImagen] = useState();
    const [nombre, setNombre] = useState();
    const [orden, setOrden] = useState();
    const [feature, setFeature] = useState(false);
    const [categoriaId, setCategoriaId] = useState();
    const [subCategoriaId, setSubCategoriaId] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;

    const handleFileChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (imagen) formData.append("image", imagen);
        if (nombre) formData.append("name", nombre);
        if (orden) formData.append("orden", orden);

        const reposnse = adminAxiosClient.post("/productos", formData, {
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
            fetchProductos(true);
            setCreateView(false);
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    // Filtrar categorías por búsqueda
    const filteredCategorias = productos
        ?.filter((category) => {
            // Si no hay término de búsqueda, mostrar todos los elementos
            if (!searchTerm) return true;

            // Si el nombre es null o undefined, aún así mostrar el elemento
            if (category?.name === null || category?.name === undefined)
                return true;

            // Filtrar normalmente los elementos con nombre
            return category.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
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
                            className="text-black"
                        >
                            <div className="bg-white p-4 w-[500px] rounded-md">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Crear producto
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="imagenn">Imagen</label>
                                    <div className="flex flex-row">
                                        <input
                                            type="file"
                                            name="imagen"
                                            id="imagenn"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            className="cursor-pointer border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                            htmlFor="imagenn"
                                        >
                                            Elegir imagen
                                        </label>
                                        <p className="self-center px-2">
                                            {imagen?.name}
                                        </p>
                                    </div>
                                    <label htmlFor="nombree">
                                        Nombre{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="nombree"
                                        id="nombree"
                                        value={nombre}
                                        onChange={(e) =>
                                            setNombre(e.target.value)
                                        }
                                    />

                                    <label htmlFor="ordennn">Orden</label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="ordennn"
                                        id="ordennn"
                                        value={orden}
                                        onChange={(e) =>
                                            setOrden(e.target.value)
                                        }
                                    />

                                    <label htmlFor="categoriass">
                                        Categoria
                                    </label>
                                    <select
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        name="categoriass"
                                        id="categoriass"
                                        value={categoriaId}
                                        onChange={(e) =>
                                            setCategoriaId(e.target.value)
                                        }
                                    >
                                        <option disabled value="">
                                            Seleccione categoria
                                        </option>
                                        {categorias?.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="sub-categoriass">
                                        Sub-categoria
                                    </label>
                                    <select
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        name="sub-categoriass"
                                        id="sub-categoriass"
                                        value={subCategoriaId}
                                        onChange={(e) =>
                                            setSubCategoriaId(e.target.value)
                                        }
                                    >
                                        <option disabled value="">
                                            Seleccione sub-categoria
                                        </option>
                                        {subCategorias
                                            ?.filter(
                                                (sub) =>
                                                    sub?.categoriaId ==
                                                    categoriaId
                                            )
                                            ?.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                    </select>

                                    <div className="flex justify-end gap-4">
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
                    Productos
                </h2>
                <div className="w-full flex h-fit flex-row gap-5">
                    <input
                        type="text"
                        placeholder="Buscar categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 border border-gray-300 rounded-md w-full"
                    />
                    <button
                        onClick={() => setCreateView(true)}
                        className="bg-primary-orange hover:bg-orange-400 w-[200px] text-white font-bold py-1 px-4 rounded"
                    >
                        Crear producto
                    </button>
                </div>

                <div className="flex justify-center w-full">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border">
                        <thead className="text-sm font-medium text-black bg-gray-300 uppercase">
                            <tr>
                                <td className="text-center">ORDEN</td>
                                <td className="text-center ">NOMBRE</td>
                                <td className="text-center ">CATEGORIA</td>
                                <td className="text-center ">SUB-CATEGORIA</td>
                                <td className="w-[400px] py-2 px-3 text-center">
                                    IMAGEN
                                </td>
                                <td className="text-center ">NOVEDAD</td>
                                <td className="text-center">EDITAR</td>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentItems?.map((category) => (
                                <ProductosCardAdmin
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
