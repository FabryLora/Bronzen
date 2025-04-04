import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
/* import soloCart from "../assets/iconos/solo-cart.svg"; */
/* import ProductCard from "../components/ProductCard";
import ProductRow from "../components/ProductRow"; */
import ProductoPrivadoRow from "../Components/ProductoPrivadoRow";
import { useStateContext } from "../context/ContextProvider";

export default function ProductosPrivado() {
    const {
        grupoDeProductos,
        productos,
        categorias,
        subProductos,
        cart,
        subCategorias,
        fetchSubProductos,
    } = useStateContext();
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
    useEffect(() => {
        if (cart.length > 0) {
            setCarrito(true);
        }
    }, [cart]);

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
            <AnimatePresence mode="popLayout">
                {carrito && (
                    <motion.div
                        onClick={() => navigate("/privado/carrito")}
                        key="cart-container" // Mantener un key estable
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                        }}
                        className="fixed flex justify-center items-center w-14 h-14 border border-primary-red rounded-full bottom-5 right-5 bg-white shadow-lg z-50 cursor-pointer"
                    >
                        <motion.div
                            key={`badge-${cart.length}`} // Clave diferente para animar el número
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1.2 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                            }}
                            className="absolute flex justify-center items-center rounded-full text-white bg-primary-red top-0 text-xs left-0 w-5 h-5"
                        >
                            {cart?.length}
                        </motion.div>
                        {/* <img src={soloCart} alt="" /> */}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="h-[473px] w-full bg-primary-blue text-black bg-primary-gray flex justify-center items-center">
                <div className="flex flex-col gap-2 justify-center max-sm:px-6 max-sm:w-full w-[1200px] mx-auto bg-white h-[231px] rounded-xl">
                    <div className="flex flex-col p-6 h-full justify-between">
                        <div className="flex flex-col gap-2 text-[#6E7173] text-[16px] h-fit">
                            <label className="font-semibold" htmlFor="avanzada">
                                Búsqueda avanzada
                            </label>
                            <input
                                id="avanzada"
                                type="text"
                                placeholder="Código, Nombre, Categoría, Sub categoría"
                                className="h-[42px]  outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                            />
                        </div>
                        <div className="flex flex-row gap-5 h-fit">
                            <div className="flex flex-col gap-2 text-[#6E7173] text-[16px]">
                                <label
                                    className="font-semibold"
                                    htmlFor="categoria"
                                >
                                    Categoría
                                </label>
                                <select
                                    className="h-[42px] w-[270px] outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                                    name=""
                                    id="categoria"
                                >
                                    <option selected disabled value="">
                                        Seleccionar categoría
                                    </option>
                                    <option value="">
                                        Todas las categorias
                                    </option>
                                    {categorias?.map((cat) => (
                                        <option key={cat?.id} value={cat?.id}>
                                            {cat?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-[#6E7173] text-[16px]">
                                <label
                                    className="font-semibold"
                                    htmlFor="sub-categoria"
                                >
                                    Sub categoria
                                </label>
                                <select
                                    className="h-[42px] w-[270px]  rounded-xl pl-3 outline outline-gray-200 focus:outline-primary-orange transition duration-300"
                                    name=""
                                    id="sub-categoria"
                                >
                                    <option selected disabled value="">
                                        Seleccionar Sub categoria
                                    </option>
                                    <option value="">
                                        Todas las Sub categorias
                                    </option>
                                    {subCategorias?.map((cat) => (
                                        <option key={cat?.id} value={cat?.id}>
                                            {cat?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 text-[#6E7173] text-[16px]">
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
                                    className="h-[42px] w-[270px] outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-[#6E7173] text-[16px]">
                                <label
                                    className="font-semibold"
                                    htmlFor="nombre"
                                >
                                    Código
                                </label>
                                <input
                                    placeholder="Código OEM"
                                    id="nombre"
                                    type="text"
                                    className="h-[42px] outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-xl pl-3"
                                />
                            </div>
                            <button className="bg-primary-orange font-bold text-white rounded-full w-[105px] h-[42px] self-end">
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
                {/* {paginatedProducts?.map((prod, index) => (
                    <ProductCard key={index} product={prod} />
                ))} */}
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
