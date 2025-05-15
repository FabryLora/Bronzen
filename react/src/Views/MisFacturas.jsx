import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import axiosClient from "../axios";
import MiFacturaRow from "../Components/MiFacturaRow";
import MisFacturasRow from "../components/MisFacturasRow";
import { useStateContext } from "../context/ContextProvider";

export default function MisFacturas() {
    const { currentUser } = useStateContext();

    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };

        // Verificar tamaño inicial
        checkScreenSize();

        // Añadir listener para cambios de tamaño
        window.addEventListener("resize", checkScreenSize);

        // Limpiar listener al desmontar
        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        axiosClient
            .get(`/facturas-user/${currentUser?.id}`)
            .then(({ data }) => {
                setFacturas(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="w-[1200px] mx-auto py-20 min-h-[500px] max-sm:w-full max-sm:py-0">
            <Toaster />
            {isMobile ? (
                facturas?.map((factura, index) => (
                    <MisFacturasRow key={index} factura={factura} />
                ))
            ) : (
                <table className=" w-full rounded-t-lg">
                    <thead className="text-white rounded-t-lg">
                        <tr className="bg-[#5A646E] font-bold">
                            <td className="h-[50px]"></td>
                            <td className="">Fecha</td>
                            <td className="">N° de pedido</td>
                            <td className="">N° de factura</td>

                            <td className="">Importe</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {loading ? (
                            <tr className="">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="h-[50vh]">
                                    <PulseLoader color="#ff6600" />
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ) : (
                            facturas?.map((factura, index) => (
                                <MiFacturaRow
                                    key={index}
                                    facturaObject={factura}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
