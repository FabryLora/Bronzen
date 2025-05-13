import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import cartButton from "../assets/icons/cartButton.svg";
import defaultPhoto from "../assets/logos/bronzen-logo.png";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function ProductoOnlyPrivada() {
    const { cart, addToCart } = useStateContext();
    const { id } = useParams();
    const [subProductos, setSubProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSubProduct, setCurrentSubProduct] = useState();
    const [currentMedida, setCurrentMedida] = useState();
    const [precioConDescuento, setPrecioConDescuento] = useState();
    const [esPantallaPequeña, setEsPantallaPequeña] = useState(false);

    useEffect(() => {
        // Crear un media query
        const mediaQuery = window.matchMedia("(max-width: 768px)"); // Cambia 768px al ancho que necesites

        // Función para manejar los cambios
        const manejarCambio = (e) => {
            setEsPantallaPequeña(e.matches);
        };

        // Verificar inicialmente
        setEsPantallaPequeña(mediaQuery.matches);

        // Agregar listener para cambios
        mediaQuery.addEventListener("change", manejarCambio);

        // Limpieza al desmontar
        return () => {
            mediaQuery.removeEventListener("change", manejarCambio);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/sub-productos/productos/${id}`)
            .then(({ data }) => {
                setSubProductos(data.data);
                setCurrentSubProduct(data.data[0]);
                setCantidad(
                    cart?.find((prod) => prod?.id == data.data[0]?.id)
                        ?.additionalInfo?.cantidad || data.data[0]?.min
                );
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        const precioConDescuento =
            Number(currentSubProduct?.precio_de_lista) -
            (Number(currentSubProduct?.precio_de_lista) *
                Number(currentSubProduct?.descuento)) /
                100;
        setPrecioConDescuento(precioConDescuento);
    }, [currentSubProduct]);

    const [cantidad, setCantidad] = useState(
        cart?.find((prod) => prod?.id == currentSubProduct?.id)?.additionalInfo
            ?.cantidad || currentSubProduct?.min
    );

    useEffect(() => {
        const existsInCart = cart.find(
            (item) => item?.id === currentSubProduct?.id
        );

        if (existsInCart) {
            addToCart(currentSubProduct, {
                cantidad,
                precio_descuento: precioConDescuento,
            });
        }
    }, [cantidad, precioConDescuento]);

    const handleChange = (value) => {
        const unidad = Number(currentSubProduct.min);
        let newValue = Math.round(value / unidad) * unidad; // Redondea al múltiplo más cercano
        if (newValue >= unidad) setCantidad(newValue);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="w-[1200px] mx-auto h-screen flex justify-center items-center">
                <PulseLoader color="#ff6600" />
            </div>
        );
    }

    return (
        <div className="relative flex w-[1200px] mx-auto py-20 max-sm:w-full max-sm:px-4">
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
            <div className="absolute left-0 top-4 flex flex-row items-center gap-1 text-sm text-[#6E7173] max-sm:px-4">
                <Link to={"/privado/productos"} className="font-medium">
                    Productos
                </Link>
                <p>{">"}</p>
                <Link to={"#"}>{currentSubProduct?.producto}</Link>
            </div>
            {/* imagen */}
            <div className="flex flex-row w-full max-sm:flex-col max-sm:gap-10">
                <div className="flex flex-row gap-5 max-sm:flex-col ">
                    <div className="w-[496px] h-[496px] max-sm:w-full border border-gray-300 rounded-lg flex justify-center order-2 max-sm:order-1">
                        <img
                            src={
                                currentSubProduct?.image
                                    ? currentSubProduct?.image
                                    : defaultPhoto
                            }
                            className="w-full h-full object-contain rounded-lg"
                            alt=""
                            onError={(e) => {
                                e.target.onerror = null; // prevents looping
                                e.target.src = defaultPhoto;
                            }}
                        />
                    </div>

                    <div className=" flex flex-col gap-3 order-1 max-sm:order-2 max-sm:flex-row">
                        {subProductos?.map((subProd) => (
                            <button
                                onClick={() => {
                                    setCurrentSubProduct(subProd);
                                }}
                                key={subProd?.id}
                                className={`w-[80px] h-[80px] rounded-lg border-primary-orange ${
                                    subProd?.id === currentSubProduct?.id
                                        ? "border"
                                        : ""
                                }`}
                            >
                                <img
                                    src={
                                        subProd?.image
                                            ? subProd?.image
                                            : defaultPhoto
                                    }
                                    className={`w-full rounded-lg h-full object-contain hover:opacity-100 transition duration-300 ${
                                        subProd?.id === currentSubProduct?.id
                                            ? ""
                                            : "opacity-50 border-gray-700 border"
                                    }`}
                                    alt=""
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-5 px-4">
                    <div className="flex flex-row gap-5">
                        <h2 className="max-sm:text-[16px] text-2xl text-[#5A5754] font-bold max-sm:self-center">
                            {currentSubProduct?.code}
                        </h2>
                        <div className="flex flex-row justify-center items-center gap-2">
                            <h2 className="text-[22px] max-sm:text-[16px] font-bold text-primary-gray">
                                {currentSubProduct?.categoria}
                            </h2>
                            <div className="h-full bg-[#5A5754] w-[2px] rounded-full"></div>
                            <h2 className="text-[22px] max-sm:text-[16px] font-bold text-primary-gray">
                                {currentSubProduct?.subCategoria}
                            </h2>
                        </div>
                    </div>
                    <div className="w-full h-[0.5px] bg-gray-300"></div>
                    <div className="w-full flex flex-col gap-4 h-full justify-between">
                        <h1 className="text-[30px] max-sm:text-[16px] font-medium text-[#222222] ">
                            {currentSubProduct?.producto}
                        </h1>
                        <div className="flex flex-row justify-between items-end">
                            <div className="flex flex-col gap-2 h-full justify-between max-sm:justify-end">
                                <p className="text-[16px] max-sm:hidden">
                                    Precio
                                </p>
                                <p className="font-semibold max-sm:font-normal max-sm:text-[18px]">
                                    $
                                    {Number(
                                        currentSubProduct?.precio_de_lista
                                    )?.toLocaleString("es-AR")}
                                </p>
                            </div>
                            <div className="relative flex flex-col gap-2 h-full justify-between max-sm:justify-end">
                                {esPantallaPequeña && (
                                    <div className="absolute -top-2 right-0  text-[#308C05] font-bold">
                                        <p>-%{currentSubProduct?.descuento}</p>
                                    </div>
                                )}
                                <p className="text-[16px] max-sm:hidden">
                                    Precio con descuento
                                </p>
                                <p className="font-semibold max-sm:text-[18px]">
                                    $
                                    {Number(
                                        currentSubProduct?.precio_de_lista -
                                            currentSubProduct?.precio_de_lista *
                                                (currentSubProduct?.descuento /
                                                    100)
                                    )?.toLocaleString("es-AR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[16px] max-sm:hidden">
                                    Cantidad
                                </p>
                                <div className="flex justify-center items-center">
                                    <div className="relative flex items-center border rounded-full border-gray-200 h-[38px] w-[64px] px-2">
                                        {/* Contenedor con botones */}
                                        <div className="flex flex-row  items-center bg-transparent justify-between  overflow-hidden">
                                            <input
                                                value={cantidad}
                                                onChange={(e) => {
                                                    const value = Number(
                                                        e.target.value
                                                    );
                                                    if (
                                                        !isNaN(value) &&
                                                        value >= 0
                                                    ) {
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
                                                                Number(
                                                                    currentSubProduct?.min
                                                                )
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
                                                                Number(
                                                                    currentSubProduct?.min
                                                                )
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
                            </div>

                            {esPantallaPequeña ? (
                                <button
                                    onClick={() =>
                                        addToCart(currentSubProduct, {
                                            cantidad,
                                            precio_descuento:
                                                precioConDescuento,
                                        })
                                    }
                                >
                                    <img src={cartButton} alt="" />
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        addToCart(currentSubProduct, {
                                            cantidad,
                                            precio_descuento:
                                                precioConDescuento,
                                        })
                                    }
                                    className="w-[184px] h-[51px] text-white bg-primary-orange fon-bold rounded-full"
                                >
                                    Agregar al pedido
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
