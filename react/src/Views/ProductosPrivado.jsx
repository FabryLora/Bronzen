import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
/* import soloCart from "../assets/iconos/solo-cart.svg"; */
/* import ProductCard from "../components/ProductCard";
import ProductRow from "../components/ProductRow"; */
import ProductoPrivadoRow from "../Components/ProductoPrivadoRow";
import ProductoPrivadoRowMobile from "../Components/ProductoPrivadoRowMobile";
import { useStateContext } from "../context/ContextProvider";

export default function ProductosPrivado() {
    const { categorias, subProductos, subCategorias, fetchSubProductos } =
        useStateContext();
    const [categoria, setCategoria] = useState("");
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [carrito, setCarrito] = useState(false);

    useEffect(() => {
        fetchSubProductos();
    }, []);

    const filteredProducts = subProductos?.filter((product) => {
        return (
            (nombre
                ? product?.nombre?.toLowerCase()?.includes(nombre.toLowerCase())
                : true) &&
            (codigo
                ? product?.codigo?.toLowerCase()?.includes(codigo.toLowerCase())
                : true) &&
            (categoria
                ? product?.categoria?.nombre
                      ?.toLowerCase()
                      ?.includes(categoria?.toLowerCase())
                : true)
        );
    });

    const totalPages = Math.ceil(
        (filteredProducts?.length || 0) / itemsPerPage
    );
    const paginatedProducts = filteredProducts?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();

    return (
        <div className="w-full pb-20 flex flex-col gap-20 max-sm:px-0">
            <div className="h-[473px] max-sm:h-auto max-sm:py-8 w-full bg-primary-blue text-black bg-primary-gray flex justify-center items-center">
                <div className="flex flex-col gap-2 justify-center max-sm:px-6 max-sm:w-full max-w-[1200px] mx-auto  sm:bg-white h-[231px] max-sm:h-auto max-sm:py-6 rounded-xl">
                    <div className="flex flex-col p-6 max-sm:p-3 h-full justify-between">
                        <div className="flex flex-col gap-2 text-[#6E7173] max-sm:text-white text-[16px] h-fit">
                            <label className="font-semibold" htmlFor="avanzada">
                                Búsqueda avanzada
                            </label>
                            <input
                                id="avanzada"
                                type="text"
                                placeholder="Código, Nombre, Categoría, Sub categoría"
                                className="h-[42px] outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                            />
                        </div>
                        <div className="flex flex-row max-sm:flex-col gap-5 max-sm:gap-3 h-fit max-sm:mt-4">
                            <div className="flex flex-col gap-2 text-[#6E7173] max-sm:text-white text-[16px] max-sm:w-full">
                                <label
                                    className="font-semibold"
                                    htmlFor="categoria"
                                >
                                    Categoría
                                </label>
                                <select
                                    className="h-[42px] w-[270px] max-sm:w-full outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                                    name=""
                                    id="categoria"
                                >
                                    <option selected disabled value="">
                                        Seleccionar categoría
                                    </option>
                                    <option className="max-sm:" value="">
                                        Todas las categorias
                                    </option>
                                    {categorias?.map((cat) => (
                                        <option
                                            className="max-sm:text-black"
                                            key={cat?.id}
                                            value={cat?.id}
                                        >
                                            {cat?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-[#6E7173] max-sm:text-white text-[16px] max-sm:w-full">
                                <label
                                    className="font-semibold"
                                    htmlFor="sub-categoria"
                                >
                                    Sub categoria
                                </label>
                                <select
                                    className="h-[42px] w-[270px] max-sm:w-full rounded-xl pl-3 outline outline-gray-200 focus:outline-primary-orange transition duration-300"
                                    name=""
                                    id="sub-categoria"
                                >
                                    <option selected disabled value="">
                                        Seleccionar Sub categoria
                                    </option>
                                    <option className="text-black" value="">
                                        Todas las Sub categorias
                                    </option>
                                    {subCategorias?.map((cat) => (
                                        <option
                                            className="max-sm:text-black"
                                            key={cat?.id}
                                            value={cat?.id}
                                        >
                                            {cat?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-[#6E7173] max-sm:text-white text-[16px] max-sm:w-full">
                                <label
                                    className="font-semibold"
                                    htmlFor="nombre"
                                >
                                    Nombre
                                </label>
                                <input
                                    placeholder="Nombre"
                                    id="nombre"
                                    type="text"
                                    className="h-[42px] w-[270px] max-sm:w-full outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-[#6E7173] max-sm:text-white text-[16px] max-sm:w-full">
                                <label
                                    className="font-semibold"
                                    htmlFor="codigo"
                                >
                                    Código
                                </label>
                                <input
                                    placeholder="Código OEM"
                                    id="codigo"
                                    type="text"
                                    className="h-[42px] max-sm:w-full outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                                />
                            </div>
                            <button className="bg-primary-orange font-bold text-white rounded-full w-[105px] h-[42px] self-end max-sm:self-center max-sm:mt-2 max-sm:w-full">
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid max-sm:hidden rounded-lg w-[1200px] mx-auto">
                <div className="grid grid-cols-11 items-center justify-center bg-[#5A646E] text-white h-[52px] font-semibold rounded-t-lg">
                    <p></p>
                    <p>Código</p>
                    <p>Rubro</p>
                    <p>Sub Rubro</p>
                    <p>Nombre</p>
                    <p className="text-center">Precio</p>
                    <p className="text-center">Descuento</p>
                    <p className="text-center">Precio con descuento</p>
                    <p className="text-center">Stock</p>
                    <p className="text-center">Cantidad</p>
                    <p className="text-center"></p>
                </div>
                <div className="h-fit">
                    {paginatedProducts?.map((prod) => (
                        <ProductoPrivadoRow
                            key={prod?.id}
                            productoObject={prod}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3 sm:hidden px-5">
                {paginatedProducts?.map((prod) => (
                    <ProductoPrivadoRowMobile key={prod?.id} product={prod} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-5">
                    <button
                        className="px-3 py-1 border rounded"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        className="px-3 py-1 border rounded"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
