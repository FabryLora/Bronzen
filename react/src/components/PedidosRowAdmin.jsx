import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function PedidosRowAdmin({ pedidoObject }) {
    const { clientes, subProductos, fetchPedidos } = useStateContext();

    const [isOpen, setIsOpen] = useState(false);
    const [facturaView, setFacturaView] = useState(false);
    const [numPedido, setNumPedido] = useState();
    const [numFactura, setNumFactura] = useState();
    const [importe, setImporte] = useState();
    const [factura, setFactura] = useState();

    const onSubmitFactura = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("factura", factura);
        formData.append("num_pedido", numPedido);
        formData.append("num_factura", numFactura);
        formData.append("importe", importe);
        formData.append("pedido_id", pedidoObject?.id);

        const response = axiosClient.post("/guardar-factura", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        toast.promise(response, {
            loading: "Subiendo...",
            success: "Subido correctamente",
            error: "Error al subir",
        });
        try {
            await response;
            console.log(response);
            setFacturaView(false);
            fetchPedidos();
        } catch (error) {
            console.error("Error al subir la factura:", error);
        }
    };

    const menuRef = useRef(null);
    const facturaRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
                // Cierra el contenedor si se hace clic fuera
            }
            if (
                facturaRef.current &&
                !facturaRef.current.contains(event.target)
            ) {
                setFacturaView(false);
                // Cierra el contenedor si se hace clic fuera
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const downloadFile = async () => {
        const filename = pedidoObject?.archivo_url.split("/").pop(); // Extraer el nombre del archivo

        const response = axiosClient.get(`/downloadarchivo/${filename}`, {
            responseType: "blob",
        });

        toast.promise(response, {
            loading: "Descargando...",
            success: "Descargado correctamente",
            error: "Error al descargar",
        });

        try {
            await response;
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
        }
    };

    const user = clientes?.find((user) => pedidoObject?.user_id == user?.id);

    const entregarPedido = async () => {
        const response = axiosClient.put(`/pedidos/${pedidoObject?.id}`, {
            entregado: "1",
        });

        toast.promise(response, {
            loading: "Entregando...",
            success: "Entregado correctamente",
            error: "Error al entregar",
        });

        try {
            await response;
            console.log(response);

            fetchPedidos();
        } catch (error) {
            console.error("Error al entregar el pedido:", error);
        }
    };

    const cancelarPedido = async () => {
        const response = axiosClient.put(`/pedidos/${pedidoObject?.id}`, {
            entregado: "0",
        });

        toast.promise(response, {
            loading: "Cancelando...",
            success: "Cancelado correctamente",
            error: "Error al cancelar",
        });

        try {
            await response;
            console.log(response);

            fetchPedidos();
        } catch (error) {
            console.error("Error al cancelar el pedido:", error);
        }
    };

    return (
        <div className="grid grid-cols-5 items-center justify-items-center py-2 border-b text-[#515A53]">
            <p>{pedidoObject?.id}</p>
            <p>{user?.name}</p>
            <div>
                {pedidoObject?.entregado != "1" ? (
                    <button
                        onClick={entregarPedido}
                        className="bg-red-500 px-2 py-1 rounded-md text-white hover:scale-95 transition-transform"
                    >
                        No entregado
                    </button>
                ) : (
                    <button
                        onClick={cancelarPedido}
                        className="bg-green-500 px-2 py-1 rounded-md text-white hover:scale-95 transition-transform"
                    >
                        Entregado
                    </button>
                )}
            </div>
            <button
                type="button"
                onClick={() => setFacturaView(true)}
                className="border border-primary-orange px-2 py-1 rounded-full text-primary-orange hover:text-white hover:bg-primary-orange transition duration-300 "
            >
                Subir factura
            </button>
            <button
                onClick={() => setIsOpen(true)}
                className="text-center py-1 w-[100px] bg-primary-orange text-white rounded-full hover:scale-95 transition-transform"
            >
                Ver
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
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
                                    Información del Cliente:
                                </h1>
                                <p>
                                    <strong>Nombre:</strong> {user.name}
                                </p>
                                <p>
                                    <strong>Correo:</strong>{" "}
                                    {user.email ? user.email : "Sin correo"}
                                </p>
                                <p>
                                    <strong>CUIT:</strong> {user.cuit}
                                </p>

                                <p>
                                    <strong>Dirección:</strong> {user.direccion}
                                </p>
                                <p>
                                    <strong>Provincia:</strong> {user.provincia}
                                </p>
                                <p>
                                    <strong>Localidad:</strong> {user.localidad}
                                </p>
                            </div>

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
                                                Sub Rubro
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Nombre
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Precio
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Descuento
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Precio con descuento
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Stock
                                            </th>
                                            <th
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                Cantidad
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidoObject?.productos?.map(
                                            (item, index) => (
                                                console.log(subProductos[0]),
                                                (
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
                                                                subProductos.find(
                                                                    (prod) =>
                                                                        prod?.id ===
                                                                        item?.subproducto_id
                                                                )?.code
                                                            }
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            {
                                                                subProductos.find(
                                                                    (prod) =>
                                                                        prod.id ===
                                                                        item.subproducto_id
                                                                )?.categoria
                                                            }
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            {
                                                                subProductos.find(
                                                                    (prod) =>
                                                                        prod?.id ===
                                                                        item?.subproducto_id
                                                                )?.subCategoria
                                                            }
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            {
                                                                subProductos.find(
                                                                    (prod) =>
                                                                        prod?.id ==
                                                                        item?.subproducto_id
                                                                )?.producto
                                                            }
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            $
                                                            {
                                                                subProductos.find(
                                                                    (prod) =>
                                                                        prod?.id ===
                                                                        item?.subproducto_id
                                                                )
                                                                    ?.precio_de_lista
                                                            }
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            {
                                                                subProductos.find(
                                                                    (prod) =>
                                                                        prod?.id ===
                                                                        item?.subproducto_id
                                                                )?.descuento
                                                            }
                                                            %
                                                        </td>

                                                        <td
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            $
                                                            {subProductos.find(
                                                                (prod) =>
                                                                    prod?.id ===
                                                                    item?.subproducto_id
                                                            )?.precio_de_lista -
                                                                (subProductos.find(
                                                                    (prod) =>
                                                                        prod?.id ===
                                                                        item?.subproducto_id
                                                                )
                                                                    ?.precio_de_lista *
                                                                    subProductos.find(
                                                                        (
                                                                            prod
                                                                        ) =>
                                                                            prod?.id ===
                                                                            item?.subproducto_id
                                                                    )
                                                                        ?.descuento) /
                                                                    100}
                                                        </td>

                                                        <td
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            {subProductos.find(
                                                                (prod) =>
                                                                    prod?.id ===
                                                                    item?.subproducto_id
                                                            )?.stock === 1
                                                                ? "Si"
                                                                : "No"}
                                                        </td>

                                                        <td
                                                            style={{
                                                                padding: "10px",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            {item?.cantidad}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                                <p>
                                    <strong>Archivo:</strong>{" "}
                                    {pedidoObject?.archivo_url ? (
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
                                    <strong>Mensaje:</strong>{" "}
                                    {pedidoObject?.mensaje}
                                </p>
                                <p>
                                    <strong>Tipo de entrega:</strong>{" "}
                                    {pedidoObject?.tipo_entrega}
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
                                        {Number(
                                            pedidoObject?.subtotal
                                        )?.toLocaleString("es-AR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                    <p>
                                        <strong>Descuento:</strong> $
                                        {Number(
                                            pedidoObject?.descuento
                                        )?.toLocaleString("es-AR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                    <p>
                                        <strong>IVA:</strong> $
                                        {Number(
                                            pedidoObject?.iva
                                        )?.toLocaleString("es-AR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>

                                    <p
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <strong>Total del pedido:</strong> $
                                        {Number(
                                            pedidoObject?.total
                                        )?.toLocaleString("es-AR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {facturaView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 text-left"
                    >
                        <form
                            ref={facturaRef}
                            onSubmit={onSubmitFactura}
                            method="POST"
                            className="text-black"
                        >
                            <div className="bg-white p-4 w-[500px] rounded-md">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Cargar Factura
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="imagenn">Archivo</label>
                                    <div className="flex flex-row">
                                        <input
                                            type="file"
                                            name="imagen"
                                            id="imagenn"
                                            onChange={(e) =>
                                                setFactura(e.target.files[0])
                                            }
                                            className="hidden"
                                        />
                                        <label
                                            className="cursor-pointer border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                            htmlFor="imagenn"
                                        >
                                            Elegir archivo
                                        </label>
                                        <p className="self-center px-2">
                                            {factura?.name}
                                        </p>
                                    </div>
                                    <label htmlFor="nombree">
                                        Numero de pedido
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="nombree"
                                        id="nombree"
                                        onChange={(e) =>
                                            setNumPedido(e.target.value)
                                        }
                                    />

                                    <label htmlFor="ordennn">
                                        Numero de factura
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="ordennn"
                                        id="ordennn"
                                        onChange={(e) =>
                                            setNumFactura(e.target.value)
                                        }
                                    />

                                    <label htmlFor="importe">Importe</label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="importe"
                                        id="importe"
                                        placeholder="ej: 1240.22"
                                        onChange={(e) =>
                                            setImporte(e.target.value)
                                        }
                                    />

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFacturaView(false)
                                            }
                                            className="border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                        >
                                            Cargar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
