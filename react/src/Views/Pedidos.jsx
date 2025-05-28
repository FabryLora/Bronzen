import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";

import { Link, useLocation } from "react-router-dom";
import axiosClient from "../axios";
/* import PedidoTemplate from "../components/PedidoTemplate";
import ProductRow from "../components/ProductRow"; */
import PedidoTemplate from "../components/PedidoTemplate";
import ProductoPrivadoRow from "../Components/ProductoPrivadoRow";
import ProductoPrivadoRowMobile from "../Components/ProductoPrivadoRowMobile";
import { useStateContext } from "../context/ContextProvider";

export default function Pedidos() {
    const {
        cart,
        clearCart,
        currentUser,
        userId,
        productos,
        informacion,
        currentUserSelected,
        currentIvaSelected,
    } = useStateContext();

    const [selected, setSelected] = useState("retiro");
    const [fileName, setFileName] = useState("Seleccionar archivo");
    const [subtotal, setSubtotal] = useState();
    const [iva, setIva] = useState();
    const [totalFinal, setTotalFinal] = useState();
    const [mensaje, setMensaje] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [tipo_entrega, setTipo_entrega] = useState("retiro cliente");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const [succ, setSucc] = useState(false);
    const [succID, setSuccID] = useState();
    const [descuentosJuntos, setDescuentosJuntos] = useState();
    const [currencyType, setCurrencyType] = useState("pesos");
    const [subtotalConDescuentoUsuario, setSubtotalConDescuentoUsuario] =
        useState();
    const [subtotalConDescuentoAdicional, setSubtotalConDescuentoAdicional] =
        useState();
    const [subtotalConDescuentoGeneral, setSubtotalConDescuentoGeneral] =
        useState();
    const [montoDescuentoRetiro, setMontoDescuentoRetiro] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setArchivo(file);
        } else {
            setFileName("Seleccionar archivo");
        }
    };

    console.log(currentUserSelected);

    useEffect(() => {
        const user =
            currentUser?.tipo === "vendedor"
                ? currentUserSelected
                : currentUser;
        if (!user) return;

        const isRetiroCliente = tipo_entrega === "retiro cliente";
        const repartoDescuento =
            isRetiroCliente && informacion?.descuento_reparto > 0
                ? informacion.descuento_reparto / 100
                : 0;

        const descuentoGeneral =
            informacion?.descuento_general > 0
                ? informacion.descuento_general / 100
                : 0;
        const descuentoAdicional =
            user?.descuento_adicional > 0 ? user.descuento_adicional / 100 : 0;
        const descuentoAdicional2 =
            user?.descuento_adicional_2 > 0
                ? user.descuento_adicional_2 / 100
                : 0;

        let subtotalGlobal = 0;
        let descuentoGeneralTotal = 0;
        let descuentoAdicionalTotal = 0;
        let descuentoAdicional2Total = 0;
        let descuentoRetiroTotal = 0;

        cart.forEach((prod) => {
            let precio = parseFloat(
                prod?.additionalInfo?.precio_descuento || 0
            );
            subtotalGlobal += precio;

            // Aplicar descuentos en cascada
            const d1 = precio * descuentoGeneral;
            const p1 = precio - d1;

            const d2 = p1 * descuentoAdicional;
            const p2 = p1 - d2;

            const d3 = p2 * descuentoAdicional2;
            const p3 = p2 - d3;

            const d4 = p3 * repartoDescuento;
            const p4 = p3 - d4;

            // Acumular descuentos
            descuentoGeneralTotal += d1;
            descuentoAdicionalTotal += d2;
            descuentoAdicional2Total += d3;
            descuentoRetiroTotal += d4;
        });

        const subtotalFinal =
            subtotalGlobal -
            (descuentoGeneralTotal +
                descuentoAdicionalTotal +
                descuentoAdicional2Total +
                descuentoRetiroTotal);

        const iva = (subtotalFinal * Number(currentIvaSelected)) / 100;
        const total = subtotalFinal + iva;

        setSubtotal(subtotalGlobal.toFixed(2));
        setSubtotalConDescuentoUsuario(
            (descuentoAdicionalTotal + descuentoAdicional2Total).toFixed(2)
        );
        setSubtotalConDescuentoGeneral(descuentoGeneralTotal.toFixed(2));
        setMontoDescuentoRetiro(descuentoRetiroTotal.toFixed(2));
        setIva(iva.toFixed(2));
        setTotalFinal(total.toFixed(2));
    }, [
        cart,
        tipo_entrega,
        currentUser,
        informacion,
        currentIvaSelected,
        currentUserSelected,
    ]);

    useEffect(() => {
        setArchivo(archivo);
        setMensaje(mensaje);
        setTipo_entrega(tipo_entrega);
    }, [archivo, mensaje, tipo_entrega]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        if (mensaje) {
            formData.append("mensaje", mensaje);
        }
        if (archivo !== null) {
            formData.append("archivo", archivo);
        }
        formData.append("tipo_entrega", tipo_entrega);
        formData.append("subtotal", subtotal ? subtotal : 0);
        formData.append(
            "descuento",
            Number(subtotalConDescuentoGeneral) + Number(montoDescuentoRetiro)
        );
        formData.append("iva", iva ? iva : 0);
        formData.append("entregado", 0);
        formData.append(
            "user_id",
            currentUser?.tipo == "vendedor"
                ? currentUserSelected?.id
                : currentUser?.id
        );
        if (totalFinal !== "0.00") {
            formData.append("total", totalFinal);
        }

        try {
            const response = await axiosClient.post("/pedidos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const pedidoId = response.data.data.id;

            setSuccID(pedidoId);

            cart.forEach((prod) => {
                const formProds = new FormData();

                formProds.append("pedido_id", pedidoId);
                formProds.append("subproducto_id", prod.id);
                formProds.append("cantidad", prod.additionalInfo.cantidad);
                formProds.append("subtotal_prod", 0);

                axiosClient.post(`/pedido-productos`, formProds, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            });

            const responsePedido = await axiosClient.get(
                `/pedidos/${pedidoId}`
            );
            const pedidoObject = responsePedido.data.data;

            const htmlContent = ReactDOMServer.renderToString(
                <PedidoTemplate
                    pedido={pedidoObject}
                    user={
                        currentUser?.tipo == "vendedor"
                            ? currentUserSelected
                            : currentUser
                    }
                    productos={productos}
                />
            );

            // Enviar email con archivos adjuntos
            const emailFormData = new FormData();
            emailFormData.append("html", htmlContent);

            if (archivo !== null) {
                emailFormData.append("attachments[]", archivo);
            }

            const responseMail = await axiosClient.post(
                "/sendpedido",
                emailFormData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            clearCart();
            setSucc(true);
            console.log(responseMail);
        } catch (error) {
            setError(true);
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="w-[1200px] max-sm:w-full mx-auto py-20 grid grid-cols-2 gap-10 max-sm:px-4">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed left-[45%] top-10 bg-red-500 text-white p-3 rounded-lg"
                    >
                        <p>Error al enviar el pedido</p>
                    </motion.div>
                )}
                {succ && (
                    <div>
                        <div className="fixed w-screen h-screen bg-black opacity-50 top-0 left-0"></div>
                        <div className="fixed transform rounded-lg -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[642px] h-[343px] bg-white text-black shadow-lg flex flex-col items-center justify-evenly">
                            <h1 className="font-bold text-[32px]">
                                Pedido confirmado
                            </h1>
                            <div className="flex flex-col gap-8 items-center">
                                <p className="text-[#515A53] text-center w-[90%]">
                                    Su pedido #{succID} está en proceso y te
                                    avisaremos por email cuando esté listo. Si
                                    tienes alguna pregunta, no dudes en
                                    contactarnos.
                                </p>
                                <Link
                                    to={"/privado/productos"}
                                    className="bg-primary-orange rounded-full font-bold text-white flex items-center justify-center h-[47px] w-[253px]"
                                >
                                    VOLVER A PRODUCTOS
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

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
                    {cart?.map((prod) => (
                        <ProductoPrivadoRow
                            key={prod?.id}
                            productoObject={prod}
                        />
                    ))}
                </div>
            </div>
            <div className="h-fit sm:hidden col-span-2">
                {cart?.map((prod) => (
                    <ProductoPrivadoRowMobile key={prod?.id} product={prod} />
                ))}
            </div>
            <div className="col-span-2">
                <div className="">
                    <Link
                        to={"/privado/productos"}
                        className="px-6 py-3 border border-primary-orange text-primary-orange font-semibold rounded-full hover:bg-primary-orange hover:text-white transition duration-300"
                    >
                        Agregar más productos
                    </Link>
                </div>
            </div>

            <div className="h-[206px] border border-gray-200 text-white  rounded-lg max-sm:col-span-2 max-sm:order-1">
                <div className="bg-[#5A646E] rounded-t-lg">
                    <h2 className="p-3 text-xl font-bold">
                        Informacion importante
                    </h2>
                </div>
                <div
                    className="p-5"
                    dangerouslySetInnerHTML={{
                        __html: informacion?.informacion,
                    }}
                />
            </div>
            <div className="h-[206px] border border-gray-200 text-white  rounded-lg max-sm:col-span-2 max-sm:order-3">
                <div className="bg-[#5A646E]  rounded-t-lg p-3">
                    <h2 className="text-lg font-semibold">Entrega</h2>
                </div>

                <div className="flex flex-col gap-6 justify-center w-full h-[160px] text-black">
                    {/* Opción: Retiro Cliente */}
                    <div
                        className={`flex items-center justify-between px-3 rounded-lg  cursor-pointer`}
                        onClick={() => {
                            setSelected("retiro");
                            setTipo_entrega("retiro cliente");
                        }}
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex items-center gap-3 w-full">
                                <div
                                    className={`w-5 h-5 rounded-full border-2 ${
                                        selected === "retiro"
                                            ? "border-primary-orange flex items-center justify-center"
                                            : "border-gray-400"
                                    }`}
                                >
                                    {selected === "retiro" && (
                                        <div className="w-[10px] h-[10px] bg-primary-orange rounded-full"></div>
                                    )}
                                </div>
                                <label className="cursor-pointer">
                                    Retiro cliente
                                </label>
                            </div>

                            {informacion?.descuento_reparto && (
                                <p className="text-sm font-bold text-[#308C05] text-[16px] w-full text-right">
                                    {informacion?.descuento_reparto}% descuento
                                </p>
                            )}
                        </div>
                    </div>

                    <div
                        className={`flex items-center justify-between pl-3 rounded-lg  cursor-pointer`}
                        onClick={() => {
                            setSelected("retiroBron");
                            setTipo_entrega("reparto bronzen");
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                    selected === "retiroBron"
                                        ? "border-primary-orange flex items-center justify-center"
                                        : "border-gray-400"
                                }`}
                            >
                                {selected === "retiroBron" && (
                                    <div className="w-[10px] h-[10px] bg-primary-orange rounded-full"></div>
                                )}
                            </div>
                            <label className="cursor-pointer">
                                Reparto Bronzen
                            </label>
                        </div>
                    </div>

                    {/* Opción: A convenir */}
                    <div
                        className={`flex items-center pl-3 rounded-lg  cursor-pointer`}
                        onClick={() => {
                            setSelected("acon");
                            setTipo_entrega("A Convenir");
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                    selected === "acon"
                                        ? "border-primary-orange flex items-center justify-center"
                                        : "border-gray-400"
                                }`}
                            >
                                {selected === "acon" && (
                                    <div className="w-[10px] h-[10px] bg-primary-orange rounded-full"></div>
                                )}
                            </div>
                            <label className="cursor-pointer">
                                A Convenir {"(Interior del pais)"}
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[206px] flex flex-col gap-3 max-sm:col-span-2 max-sm:order-2">
                <div className="">
                    <h2 className=" text-xl font-bold">
                        Escribinos un mensaje
                    </h2>
                </div>
                <textarea
                    value={mensaje}
                    onChange={(e) => {
                        setMensaje(e.target.value);
                    }}
                    className="outline outline-gray-200 focus:outline-primary-orange transition duration-300 rounded-lg h-[222px] w-full p-3"
                    name=""
                    id=""
                    rows={10}
                    placeholder="Dias especiales de entrega, cambios de domicilio, expresos, requerimientos especiales en la mercaderia, exenciones."
                ></textarea>
            </div>

            <div className="h-fit border border-gray-200 text-white rounded-lg max-sm:col-span-2 max-sm:order-5">
                <div className="bg-[#5A646E] rounded-t-lg">
                    <h2 className="p-3 text-xl font-bold">Pedido</h2>
                </div>

                <div className="flex flex-col justify-between px-4 text-[18px] gap-6 py-6 border-b text-black">
                    <div className="flex flex-row justify-between w-full">
                        <p>Subtotal</p>
                        <p>
                            $
                            {Number(subtotal)?.toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>

                    {/* Descuento por cantidad/oferta ya está aplicado en el cálculo del precio de cada producto */}

                    {(currentUser?.tipo === "vendedor"
                        ? currentUserSelected
                        : currentUser
                    )?.descuento > 0 && (
                        <div className="flex flex-row justify-between w-full text-[#308C05]">
                            <p>
                                Descuento Cliente{" "}
                                {
                                    (currentUser?.tipo === "vendedor"
                                        ? currentUserSelected
                                        : currentUser
                                    )?.descuento
                                }
                                %
                            </p>
                            <p>
                                -$
                                {Number(
                                    subtotalConDescuentoUsuario
                                )?.toLocaleString("es-AR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    )}

                    {informacion?.descuento_general > 0 && (
                        <div className="flex flex-row justify-between w-full text-[#308C05]">
                            <p>
                                Descuento{" "}
                                {informacion?.descuento_general +
                                    (currentUser?.tipo === "vendedor"
                                        ? currentUserSelected
                                        : currentUser
                                    )?.descuento_adicional +
                                    (currentUser?.tipo === "vendedor"
                                        ? currentUserSelected
                                        : currentUser
                                    )?.descuento_adicional_2}
                                %
                            </p>
                            <p>
                                -$
                                {Number(
                                    subtotalConDescuentoGeneral
                                )?.toLocaleString("es-AR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    )}

                    {tipo_entrega === "retiro cliente" &&
                        informacion?.descuento_reparto > 0 && (
                            <div className="flex flex-row justify-between w-full text-[#308C05]">
                                <p>
                                    Descuento por Retiro{" "}
                                    {informacion?.descuento_reparto}%
                                </p>
                                <p>
                                    -$
                                    {Number(
                                        montoDescuentoRetiro
                                    )?.toLocaleString("es-AR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        )}

                    <div className="flex flex-row justify-between w-full">
                        <p>
                            IVA{" "}
                            {Number(currentIvaSelected)?.toLocaleString(
                                "es-AR",
                                {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 1,
                                }
                            )}
                            %
                        </p>
                        <p>
                            $
                            {Number(iva)?.toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row justify-between p-3 text-black text-[24px]">
                    <p className="font-medium ">
                        Total{" "}
                        {currencyType === "pesos" && (
                            <span className="text-base">
                                {"(IVA incluido)"}
                            </span>
                        )}
                    </p>
                    <p className="">
                        $
                        {Number(totalFinal)?.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 max-sm:col-span-2 max-sm:order-4">
                <h2 className="font-bold text-2xl">Adjuntar un archivo</h2>
                <div className="w-full border border-gray-200 rounded-lg flex items-center justify-between">
                    <span className="text-gray-600 pl-4">{fileName}</span>
                    <label
                        htmlFor="fileInput"
                        className="text-primary-orange ronuded-r-lg font-semibold h-full cursor-pointer p-4 bg-gray-100 hover:bg-gray-200"
                    >
                        ADJUNTAR
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-3 w-full max-sm:col-span-2 max-sm:order-6 items-end">
                <Link
                    to={"/privado/productos"}
                    onClick={clearCart}
                    className="h-[51px] w-full border border-primary-orange rounded-full text-primary-orange flex items-center justify-center border-primary-red text-primary-red hover:scale-95 transition-transform"
                >
                    CANCELAR PEDIDO
                </Link>
                <button
                    onClick={handleSubmit}
                    className={`w-full h-[47px] text-white font-bold bg-primary-orange rounded-full hover:scale-95 transition-transform ${
                        isSubmitting ? "bg-gray-400" : "bg-primary-red"
                    }`}
                >
                    {isSubmitting ? "Enviando pedido..." : "REALIZAR PEDIDO"}
                </button>
            </div>
        </div>
    );
}
