import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cartButton from "../assets/icons/cartButton.svg";
import hoverCartButton from "../assets/icons/hoverCartButton.svg";
import hoverTrashButton from "../assets/icons/hoverTrashButton.png";
import trashButton from "../assets/icons/trashButton.png";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import { useStateContext } from "../context/ContextProvider";

export default function ProductoPrivadoRow({ productoObject }) {
    const { cart, addToCart, removeFromCart } = useStateContext();
    const [precioConDescuento, setPrecioConDescuento] = useState();
    const location = useLocation();

    useEffect(() => {
        const precioConDescuento =
            Number(productoObject?.precio_de_lista) -
            (Number(productoObject?.precio_de_lista) *
                Number(productoObject?.descuento)) /
                100;
        setPrecioConDescuento(precioConDescuento);
    }, [productoObject]);

    const [cantidad, setCantidad] = useState(
        cart?.find((prod) => prod?.id == productoObject?.id)?.additionalInfo
            ?.cantidad || productoObject?.min
    );

    useEffect(() => {
        const existsInCart = cart.find((item) => item.id === productoObject.id);

        if (existsInCart) {
            addToCart(productoObject, {
                cantidad,
                precio_descuento: precioConDescuento,
            });
        }
    }, [cantidad, precioConDescuento]);

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
                <Link to={`${location?.pathname}/${productoObject?.id}`}>
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
                {Number(productoObject?.precio_de_lista)?.toLocaleString(
                    "es-AR",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }
                )}
            </p>
            <p className="text-center self-center text-[#308C05] font-bold">
                %{productoObject?.descuento}
            </p>
            <p className="text-center self-center ">
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
                        onClick={() =>
                            addToCart(productoObject, {
                                cantidad,
                                precio_descuento: precioConDescuento,
                            })
                        }
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
