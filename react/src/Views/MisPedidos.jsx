import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import axiosClient from "../axios";
import MiPedidoRow from "../components/MiPedidoRow";
import { useStateContext } from "../context/ContextProvider";

export default function Mispedidos() {
    const { currentUser, fetchSubProductos } = useStateContext();

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        axiosClient
            .get(`/pedidos-usuarios/${currentUser?.id}`)
            .then(({ data }) => {
                setPedidos(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
        fetchSubProductos();
    }, []);

    return (
        <div className="w-[1200px] mx-auto py-20 min-h-[500px]">
            <Toaster />
            <table className=" w-full rounded-t-lg">
                <thead className="text-white rounded-t-lg">
                    <tr className="bg-[#5A646E] font-bold">
                        <td className="h-[50px]"></td>
                        <td className="text-center">N° de pedido</td>
                        <td>Fecha de compra</td>
                        <td>Detalle</td>
                        <td>Fecha de entrega</td>

                        <td className="text-center">Entregado</td>
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
                        pedidos?.map((pedido, index) => (
                            <MiPedidoRow
                                key={index}
                                pedido={pedido}
                                productosPed={pedido?.productos}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
