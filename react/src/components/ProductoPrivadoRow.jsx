import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import cartButton from "../assets/icons/cartButton.svg";
import hoverCartButton from "../assets/icons/hoverCartButton.svg";
import hoverTrashButton from "../assets/icons/hoverTrashButton.png";
import trashButton from "../assets/icons/trashButton.png";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import { useStateContext } from "../context/ContextProvider";

export default function ProductoPrivadoRow({ productoObject }) {
    const {
        cart,
        addToCart,
        removeFromCart,
        currentUser,
        currentUserSelected,
        informacion,
    } = useStateContext();
    const [precioConDescuento, setPrecioConDescuento] = useState();
    const [oferta, setOferta] = useState(false);
    const location = useLocation();
    const [precioConDescuentoBefore, setPrecioConDescuentoBefore] = useState();

    const [cantidad, setCantidad] = useState(
        cart?.find((prod) => prod?.id == productoObject?.id)?.additionalInfo
            ?.cantidad || productoObject?.min
    );

    useEffect(() => {
        let precioConDescuento;
        let precioConDescuentoReal;
        const user =
            !currentUser?.tipo === "vendedor"
                ? currentUser
                : currentUserSelected;
        if (
            cantidad >= productoObject?.min_oferta &&
            productoObject?.min_oferta != null
        ) {
            precioConDescuentoReal =
                Number(productoObject?.precio_de_oferta) -
                (Number(productoObject?.precio_de_oferta) *
                    Number(productoObject?.descuento)) /
                    100;
            setOferta(true);
            precioConDescuento = Number(productoObject?.precio_de_oferta);
            let p1 =
                precioConDescuento * (informacion?.descuento_general / 100);
            let p2 =
                (precioConDescuento - p1) * (user?.descuento_adicional / 100);
            let p3 =
                (precioConDescuento - p1 - p2) *
                (user?.descuento_adicional_2 / 100);
            let p4 =
                (precioConDescuento - p1 - p2 - p3) *
                (informacion?.descuento_reparto / 100);
            precioConDescuento -= p1 + p2 + p3 + p4;
        } else {
            setOferta(false);
            precioConDescuentoReal =
                Number(productoObject?.precio_de_lista) -
                (Number(productoObject?.precio_de_lista) *
                    Number(productoObject?.descuento)) /
                    100;
            precioConDescuento = Number(productoObject?.precio_de_lista);

            let p1 =
                precioConDescuento * (informacion?.descuento_general / 100);
            let p2 =
                (precioConDescuento - p1) * (user?.descuento_adicional / 100);
            let p3 =
                (precioConDescuento - p1 - p2) *
                (user?.descuento_adicional_2 / 100);
            let p4 =
                (precioConDescuento - p1 - p2 - p3) *
                (informacion?.descuento_reparto / 100);
            precioConDescuento -= p1 + p2 + p3 + p4;
        }
        setPrecioConDescuentoBefore(precioConDescuentoReal * cantidad);
        setPrecioConDescuento(precioConDescuento * cantidad);
    }, [productoObject, cantidad]);

    useEffect(() => {
        const existsInCart = cart.find((item) => item.id === productoObject.id);

        if (existsInCart) {
            addToCart(productoObject, {
                cantidad,
                precio_descuento: precioConDescuentoBefore,
            });
        }
    }, [cantidad, precioConDescuentoBefore]);

    const [hoverCart, setHoverCart] = useState(false);

    const handleChange = (value) => {
        const unidad = Number(productoObject.min);
        let newValue = Math.round(value / unidad) * unidad; // Redondea al múltiplo más cercano
        if (newValue >= unidad) setCantidad(newValue);
    };

    return (
        <div className="grid grid-cols-11 border-b border-gray-200 py-2 text-sm">
            <style>
                {`
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                input[type="number"] {
                    -moz-appearance: textfield;
                }
                `}
            </style>
            <p>
                <Link
                    to={`${location?.pathname}/${productoObject?.productoId}`}
                >
                    <div className="w-[85px] h-[85px] border rounded-lg border-gray-200">
                        <img
                            src={
                                productoObject?.image
                                    ? productoObject?.image
                                    : defaultPhoto
                            }
                            className="w-full h-full object-contain rounded-lg object-center"
                            alt=""
                        />
                    </div>
                </Link>
            </p>
            <p className="self-center font-bold text-[15px]">
                {productoObject?.code}
            </p>
            <p className="self-center">{productoObject?.categoria}</p>
            <p className="self-center pr-3">{productoObject?.subCategoria}</p>
            <p className="self-center">{productoObject?.producto}</p>
            <p className="self-center text-center">
                ${" "}
                {Number(
                    productoObject?.precio_de_lista * cantidad
                )?.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </p>
            <p className="text-center self-center text-[#308C05] font-bold">
                {(() => {
                    const descuentos = [];

                    const user = currentUserSelected || currentUser;
                    
                    if (productoObject?.descuento > 0)
                        descuentos.push(`${productoObject.descuento}%`);
                    if (user?.descuento_adicional > 0)
                        descuentos.push(`${user.descuento_adicional}%`);
                    if (user?.descuento_adicional_2 > 0)
                        descuentos.push(`${user.descuento_adicional_2}%`);
                    if (informacion?.descuento_general > 0)
                        descuentos.push(`${informacion.descuento_general}%`);

                    return descuentos.join(" + ");
                })()}
            </p>

            <p className="text-center self-center relative">
                {oferta && (
                    <div className="text-[11px] text-[#308C05] font-bold absolute w-full -top-4 right-0">
                        OFERTA APLICADA
                    </div>
                )}
                ${" "}
                {precioConDescuento?.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </p>
            <div className="text-center self-center flex justify-center items-center">
                <div
                    className={`w-[22px] h-[22px] rounded-full  ${
                        productoObject?.stock === 1
                            ? "bg-[#308C05]"
                            : "bg-[#DB1C1C]"
                    }`}
                ></div>
            </div>
            <div className="flex justify-center items-center">
                <div className="relative flex items-center border rounded-full border-gray-200 h-[38px] w-[64px] px-2">
                    {/* Contenedor con botones */}
                    <div className="flex flex-row  items-center bg-transparent justify-between  overflow-hidden">
                        <input
                            value={cantidad}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (!isNaN(value) && value >= 0) {
                                    handleChange(value);
                                }
                            }}
                            type="number"
                            className="text-base text-[#6E7173] w-full outline-none border-none bg-transparent text-left"
                        />

                        <div className="flex flex-col justify-center h-full">
                            <button
                                className="flex items-center max-h-[12px]"
                                onClick={() =>
                                    handleChange(
                                        Number(cantidad) +
                                            Number(productoObject?.min)
                                    )
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faChevronUp}
                                    size="xs"
                                    color="#6E7173"
                                />
                            </button>
                            <button
                                className="flex items-center max-h-[12px]"
                                onClick={() =>
                                    handleChange(
                                        Number(cantidad) -
                                            Number(productoObject?.min)
                                    )
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    size="xs"
                                    color="#6E7173"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center">
                {location?.pathname?.includes("pedido") ? (
                    <button
                        onMouseEnter={() => setHoverCart(true)}
                        onMouseLeave={() => setHoverCart(false)}
                        onClick={() => removeFromCart(productoObject?.id)}
                    >
                        {!hoverCart ? (
                            <img
                                src={hoverTrashButton}
                                className="w-[61px] h-[39px]"
                                alt=""
                            />
                        ) : (
                            <img
                                src={trashButton}
                                className="w-[61px] h-[39px]"
                                alt=""
                            />
                        )}
                    </button>
                ) : (
                    <button
                        onMouseEnter={() => setHoverCart(true)}
                        onMouseLeave={() => setHoverCart(false)}
                        onClick={() => {
                            addToCart(productoObject, {
                                cantidad,
                                precio_descuento: precioConDescuento,
                            });
                            toast.success("Producto agregado al carrito", {
                                position: "top-right",
                            });
                        }}
                    >
                        {!hoverCart ? (
                            <img
                                src={cartButton}
                                className="w-[61px] h-[39px]"
                                alt=""
                            />
                        ) : (
                            <img
                                src={hoverCartButton}
                                className="w-[61px] h-[39px]"
                                alt=""
                            />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
