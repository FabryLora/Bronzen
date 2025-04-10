import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
/* import checkIcon from "../assets/iconos/check-icon.svg";
import pedidoIcon from "../assets/iconos/pedido-icon.svg"; */
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pedidoIcon from "../assets/icons/pedidoIcon.png";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function MiPedidoRow({ pedido, productosPed }) {
    const [isOpen, setIsOpen] = useState(false);

    const { userInfo, productos, addToCart } = useStateContext();

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
                // Cierra el contenedor si se hace clic fuera
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const downloadFile = async () => {
        try {
            const filename = pedido?.archivo_url.split("/").pop(); // Extraer el nombre del archivo

            const response = await axiosClient.get(
                `/downloadarchivo/${filename}`,
                {
                    responseType: "blob",
                }
            );

            // Obtener el tipo de archivo dinámicamente desde la respuesta
            const fileType =
                response.headers["content-type"] || "application/octet-stream";
            const blob = new Blob([response.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename; // Descargar con el nombre original
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
            toast.error("Error al descargar el archivo");
        }
    };
    ///////asd

    const addSeveralProductsToCart = () => {
        productosPed.forEach((producto) => {
            let prod = productos?.find(
                (prod) => prod?.id == producto?.producto_id
            );

            addToCart(prod, {
                cantidad: producto?.cantidad,
                subtotal: producto?.subtotal_prod,
            });
        });
    };

    return (
        <tr className="border-b border-gray-300">
            <td className="py-2">
                <div className="flex items-center justify-center w-[80px] h-[80px] bg-[#F5F5F5]">
                    <img src={pedidoIcon} alt="" />
                </div>
            </td>
            <td className="text-center"> {pedido?.id}</td>
            <td>{pedido?.created_at?.split("T")[0]}</td>
            <td>
                {pedido?.mensaje ? (
                    pedido?.mensaje
                ) : (
                    <p className="text-gray-500">Sin detalles</p>
                )}
            </td>
            <td>
                {pedido?.entregado != "1" ? (
                    <p className="text-gray-500">No entregado</p>
                ) : (
                    pedido?.updated_at?.split("T")[0]
                )}
            </td>

            <td className="py-2 text-center">
                <div className="flex items-center justify-center w-[80px] h-[80px]  mx-auto">
                    <div className="border border-gray-300 w-[40px] h-[40px] flex justify-center items-center">
                        {pedido?.entregado == "1" && (
                            <FontAwesomeIcon
                                icon={faCheck}
                                size="xl"
                                color="#FF9E19"
                            />
                        )}
                    </div>
                </div>
            </td>

            <td>
                <div className="flex flex-row  justify-evenly">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-[114px] h-[51px] flex justify-center items-center border border-primary-orange text-primary-orange rounded-full hover:scale-95 transition-transform"
                    >
                        Ver detalles
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            addSeveralProductsToCart();
                            toast.success("Productos agregados al carrito", {
                                autoClose: 2000,
                                position: "top-right",
                            });
                        }}
                        className="w-[114px] h-[51px] flex justify-center items-center bg-primary-orange rounded-full text-white hover:scale-95 transition-transform"
                    >
                        Recomprar
                    </button>
                </div>
            </td>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <div
                            ref={menuRef}
                            style={{
                                fontFamily: "Arial, sans-serif",
                                maxWidth: "1000px",
                                margin: "auto",
                                padding: "20px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                            }}
                            className="relative max-h-[90vh] overflow-y-auto scrollbar-hide"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-5"
                            >
                                X
                            </button>

                            <div style={{ marginBottom: "20px" }}>
                                <h1
                                    style={{
                                        borderBottom: "2px solid #333",
                                        paddingBottom: "5px",
                                    }}
                                >
                                    Información del Pedido:
                                </h1>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                backgroundColor: "#333",
                                                color: "#fff",
                                            }}
                                        >
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Código
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Rubro
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Descripcion
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Precio Unitario
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Unidad de venta
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Cantidad
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedido.productos.map((item, index) => (
                                            <tr
                                                key={index}
                                                style={{
                                                    backgroundColor:
                                                        index % 2 === 0
                                                            ? "#fff"
                                                            : "#f2f2f2",
                                                }}
                                            >
                                                <td
                                                    style={{
                                                        padding: "10px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    {
                                                        productos.find(
                                                            (prod) =>
                                                                prod?.id ===
                                                                item?.producto_id
                                                        )?.codigo
                                                    }
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "10px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    {
                                                        productos.find(
                                                            (prod) =>
                                                                prod.id ===
                                                                item.producto_id
                                                        )?.categoria?.nombre
                                                    }
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "10px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    {
                                                        productos.find(
                                                            (prod) =>
                                                                prod?.id ===
                                                                item?.producto_id
                                                        )?.nombre
                                                    }
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "10px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    $
                                                    {userInfo?.lista == "1"
                                                        ? productos?.find(
                                                              (prod) =>
                                                                  prod?.id ==
                                                                  item?.producto_id
                                                          )?.precio_minorista
                                                        : productos.find(
                                                              (prod) =>
                                                                  prod?.id ==
                                                                  item?.producto_id
                                                          )?.precio_mayorista}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "10px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    {
                                                        productos.find(
                                                            (prod) =>
                                                                prod?.id ===
                                                                item?.producto_id
                                                        )?.unidad_venta
                                                    }
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "10px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    {item?.cantidad}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "10px",
                                                        border: "1px solid #ddd",
                                                    }}
                                                >
                                                    ${item?.subtotal_prod}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p>
                                    <strong>Archivo:</strong>{" "}
                                    {pedido?.archivo_url ? (
                                        <button
                                            onClick={downloadFile}
                                            className="bg-blue-500 px-2 py-1 rounded-md text-white"
                                        >
                                            Descargar archivo
                                        </button>
                                    ) : (
                                        "Sin archivo"
                                    )}
                                </p>
                                <p>
                                    <strong>Mensaje:</strong> {pedido?.mensaje}
                                </p>
                                <p>
                                    <strong>Tipo de entrega:</strong>{" "}
                                    {pedido?.tipo_entrega}
                                </p>

                                <div
                                    style={{
                                        backgroundColor: "#f2f2f2",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        marginTop: "10px",
                                    }}
                                >
                                    <p>
                                        <strong>Subtotal:</strong> $
                                        {pedido?.subtotal}
                                    </p>

                                    <p>
                                        <strong>IVA:</strong> ${pedido?.iva}
                                    </p>

                                    <p
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <strong>Total del pedido:</strong> $
                                        {pedido?.total}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </tr>
    );
}
