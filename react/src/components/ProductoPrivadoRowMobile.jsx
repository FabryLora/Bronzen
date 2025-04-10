import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cartButton from "../assets/icons/cartButton.svg";
import trashButton from "../assets/icons/hoverTrashButton.png";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import { useStateContext } from "../context/ContextProvider";

const ProductoPrivadoRowMobile = ({ product }) => {
    const { cart, addToCart, removeFromCart } = useStateContext();
    const [precioConDescuento, setPrecioConDescuento] = useState();

    const location = useLocation();

    useEffect(() => {
        const precioConDescuento =
            Number(product?.precio_de_lista) -
            (Number(product?.precio_de_lista) * Number(product?.descuento)) /
                100;
        setPrecioConDescuento(precioConDescuento);
    }, [product]);

    const [cantidad, setCantidad] = useState(
        cart?.find((prod) => prod?.id == product?.id)?.additionalInfo
            ?.cantidad || product?.min
    );

    useEffect(() => {
        const existsInCart = cart.find((item) => item.id === product.id);

        if (existsInCart) {
            addToCart(product, {
                cantidad,
                precio_descuento: precioConDescuento,
            });
        }
    }, [cantidad, precioConDescuento]);

    const handleChange = (value) => {
        const unidad = Number(product.min);
        let newValue = Math.round(value / unidad) * unidad; // Redondea al múltiplo más cercano
        if (newValue >= unidad) setCantidad(newValue);
    };

    return (
        <div className="flex items-center max-w-xl border-b py-2 border-gray-200">
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
            {/* Product Image */}
            <Link
                to={`${location?.pathname}/${product?.id}`}
                className="max-w-[121px] max-h-[121px] border border-[#EAEAEA]  rounded-lg flex items-center justify-center p-2 mr-4"
            >
                <img
                    src={product?.image ? product?.image : defaultPhoto}
                    className="w-full h-full object-contain rounded-lg"
                />
            </Link>

            {/* Product Details */}
            <div className="flex flex-col w-full">
                {/* Product Code and Category */}
                <div className="text-xs text-gray-600 mb-1">
                    {product?.code} <span className="mx-1">|</span>{" "}
                    {product?.categoria}
                    &gt; {product?.subCategoria}
                </div>

                {/* Product Name */}
                <h3 className="text-[15px] font-medium text-gray-800 mb-3">
                    {product?.producto}
                </h3>

                {/* Pricing Section */}

                <div className="flex items-center mb-3 justify-end">
                    {product?.descuento > 0 && (
                        <>
                            <span className="text-[#308C05] text-xs font-medium mr-2">
                                -{product?.descuento}%
                            </span>
                            <span className="text-gray-500 line-through mr-2">
                                ${product?.precio_de_lista}
                            </span>
                        </>
                    )}
                    {product?.descuento > 0 ? (
                        <span className="text-lg font-bold">
                            $
                            {(
                                product?.precio_de_lista -
                                (product?.precio_de_lista *
                                    product?.descuento) /
                                    100
                            ).toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    ) : (
                        <span className="text-lg font-bold">
                            $
                            {product?.precio_de_lista.toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    )}
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-between">
                    {/* Stock Indicator */}
                    {product?.stock === 1 ? (
                        <div className="flex items-center mr-4">
                            <div className="w-3 h-3 bg-[#308C05] rounded-full mr-1"></div>
                            <span className="text-sm">En stock</span>
                        </div>
                    ) : (
                        <div className="flex items-center mr-4">
                            <div className="w-3 h-3 bg-[#DB1C1C] rounded-full mr-1"></div>
                            <span className="text-sm">Sin stock</span>
                        </div>
                    )}

                    {/* Quantity Selector */}
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
                                                    Number(product?.min)
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
                                                    Number(product?.min)
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

                    {location?.pathname?.includes("pedido") ? (
                        <button onClick={() => removeFromCart(product?.id)}>
                            <img
                                src={trashButton}
                                className="w-[61px] h-[39px]"
                                alt=""
                            />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                addToCart(product, {
                                    cantidad,
                                    precio_descuento: precioConDescuento,
                                })
                            }
                        >
                            <img
                                src={cartButton}
                                className="w-[61px] h-[39px]"
                                alt=""
                            />
                        </button>
                    )}

                    {/* Add to Cart Button */}
                </div>
            </div>
        </div>
    );
};

export default ProductoPrivadoRowMobile;
