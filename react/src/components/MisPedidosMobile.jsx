import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import logoPedido from "../assets/icons/pedidoIcon.png";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function MisPedidosMobile({ pedido, productosPed }) {
    const [isOpen, setIsOpen] = useState(false);

    const { subProductos, addToCart } = useStateContext();

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
            let prod = subProductos?.find(
                (prod) => prod?.id == producto?.subproducto_id
            );

            addToCart(prod, {
                cantidad: producto?.cantidad,
                subtotal: producto?.subtotal_prod,
            });
        });
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  >
                    <div
                      ref={menuRef}
                      className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-y-auto"
                    >
                      {/* Botón cerrar */}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-4 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
                        aria-label="Cerrar"
                      >
                        X
                      </button>
              
                      <div className="p-6">
                        <h1 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-6">
                          Información del Pedido
                        </h1>
              
                        {/* Tabla/Cards de productos */}
                        <div className="mb-8">
                          {/* Versión desktop - tabla */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse mb-6">
                              <thead>
                                <tr className="bg-gray-800 text-white">
                                  <th className="p-3 text-left">Código</th>
                                  <th className="p-3 text-left">Rubro</th>
                                  <th className="p-3 text-left">Sub Rubro</th>
                                  <th className="p-3 text-left">Nombre</th>
                                  <th className="p-3 text-right">Precio</th>
                                  <th className="p-3 text-right">Desc.</th>
                                  <th className="p-3 text-right">P. Final</th>
                                  <th className="p-3 text-center">Stock</th>
                                  <th className="p-3 text-center">Cant.</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productosPed?.map((item, index) => {
                                  const producto = subProductos.find(
                                    (prod) => prod?.id === item?.subproducto_id
                                  );
                                  
                                  const precioLista = Number(producto?.precio_de_lista || 0);
                                  const descuento = Number(producto?.descuento || 0);
                                  const precioFinal = precioLista - (precioLista * descuento) / 100;
                                  
                                  return (
                                    <tr
                                      key={index}
                                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                      <td className="p-3 border-b">{producto?.code}</td>
                                      <td className="p-3 border-b">{producto?.categoria}</td>
                                      <td className="p-3 border-b">{producto?.subCategoria}</td>
                                      <td className="p-3 border-b">{producto?.producto}</td>
                                      <td className="p-3 border-b text-right">
                                        ${precioLista.toLocaleString("es-AR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                      </td>
                                      <td className="p-3 border-b text-right">{descuento}%</td>
                                      <td className="p-3 border-b text-right">
                                        ${precioFinal.toLocaleString("es-AR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                      </td>
                                      <td className="p-3 border-b text-center">
                                        {producto?.stock === 1 ? "Sí" : "No"}
                                      </td>
                                      <td className="p-3 border-b text-center">{item?.cantidad}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
              
                          {/* Versión móvil - cards */}
                          <div className="md:hidden space-y-4">
                            {productosPed?.map((item, index) => {
                              const producto = subProductos.find(
                                (prod) => prod?.id === item?.subproducto_id
                              );
                              
                              const precioLista = Number(producto?.precio_de_lista || 0);
                              const descuento = Number(producto?.descuento || 0);
                              const precioFinal = precioLista - (precioLista * descuento) / 100;
                              
                              return (
                                <div 
                                  key={index} 
                                  className="p-4 border rounded-md shadow-sm bg-white"
                                >
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <p className="text-sm text-gray-500">Código</p>
                                      <p className="font-medium">{producto?.code}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Cantidad</p>
                                      <p className="font-medium text-right">{item?.cantidad}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-500">Nombre</p>
                                    <p className="font-medium">{producto?.producto}</p>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-500">Categoría</p>
                                    <p className="font-medium">{producto?.categoria} - {producto?.subCategoria}</p>
                                  </div>
                                  
                                  <div className="mt-3 grid grid-cols-3 gap-2">
                                    <div>
                                      <p className="text-sm text-gray-500">Precio</p>
                                      <p className="font-medium">
                                        ${precioLista.toLocaleString("es-AR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Descuento</p>
                                      <p className="font-medium">{descuento}%</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Precio Final</p>
                                      <p className="font-medium font-bold">
                                        ${precioFinal.toLocaleString("es-AR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-500">Stock</p>
                                    <p className="font-medium">{producto?.stock === 1 ? "Disponible" : "Sin stock"}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
              
                        {/* Información adicional */}
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">Archivo:</span>
                            {pedido?.archivo_url ? (
                              <button
                                onClick={downloadFile}
                                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-white text-sm"
                              >
                                Descargar archivo
                              </button>
                            ) : (
                              <span>Sin archivo</span>
                            )}
                          </div>
                          
                          <div>
                            <span className="font-semibold">Mensaje:</span>
                            <p className="mt-1">{pedido?.mensaje || "Sin mensaje"}</p>
                          </div>
                          
                          <div>
                            <span className="font-semibold">Tipo de entrega:</span>
                            <span className="ml-2">{pedido?.tipo_entrega}</span>
                          </div>
                        </div>
              
                        {/* Resumen de precio */}
                        <div className="mt-6 bg-gray-100 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>
                              ${Number(pedido?.subtotal || 0).toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Descuento:</span>
                            <span>
                              ${Number(pedido?.descuento || 0).toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>IVA:</span>
                            <span>
                              ${Number(pedido?.iva || 0).toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          
                          <div className="flex justify-between pt-2 border-t border-gray-300 font-bold text-lg">
                            <span>Total del pedido:</span>
                            <span>
                              ${Number(pedido?.total || 0).toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
            <div className="w-full flex flex-col justify-center items-center px-2 gap-4 border-b border-[#EAEAEA] py-4">
                <div className="flex flex-row w-full gap-6">
                    <div className="flex items-center justify-center bg-[#F5F5F5] h-[95px] w-[95px] rounded-md">
                        <img src={logoPedido} alt="" />
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-x-4">
                        <div className="flex flex-col">
                            <p className="font-bold text-xs">Nº DE PEDIDO</p>
                            <p className="text-xs">{pedido?.id}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-bold text-xs">FECHA</p>
                            <p className="text-xs">
                                {pedido?.created_at
                                    ?.split("T")[0]
                                    ?.split("-")
                                    ?.reverse()
                                    ?.join("/")}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-bold text-xs">
                                FECHA DE ENTREGA
                            </p>
                            <p className="text-xs">
                                {pedido?.updated_at
                                    ?.split("T")[0]
                                    ?.split("-")
                                    ?.reverse()
                                    ?.join("/")}
                            </p>
                        </div>
                        <div className="flex flex-row gap-2 self-center">
                            <div className="w-[16px] h-[16px] border border-[#EAEAEA] flex items-center justify-center">
                                {pedido?.entregado ? (
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        size="xs"
                                        color="#ff9e19"
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                            <p className="font-bold text-xs">ENTREGADO</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-full justify-between gap-3">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-full rounded-full font-bold text-primary-orange border border-primary-orange h-[40px] "
                    >
                        Ver detalle
                    </button>
                    <button
                        onClick={() => {
                            addSeveralProductsToCart();
                            toast.success("Productos agregados al carrito", {
                                autoClose: 2000,
                                position: "top-right",
                            });
                        }}
                        className="w-full rounded-full font-bold text-white border border-primary-orange bg-primary-orange h-[40px] "
                    >
                        Recomprar
                    </button>
                </div>
            </div>
        </>
    );
}
