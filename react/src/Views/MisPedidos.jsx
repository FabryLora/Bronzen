import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import MiPedidoRow from "../components/MiPedidoRow";
import { useStateContext } from "../context/ContextProvider";

export default function Mispedidos() {
    const { pedidos, currentUser /* fetchPedidos */ } = useStateContext();

    useEffect(() => {
        window.scrollTo(0, 0);
        /* fetchPedidos(); */
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
                <tbody>
                    {pedidos
                        ?.filter((pedido) => pedido?.user_id === userInfo?.id)
                        ?.map((pedido, index) => (
                            <MiPedidoRow
                                key={index}
                                pedido={pedido}
                                productosPed={pedido.productos}
                            />
                        ))}
                </tbody>
            </table>
        </div>
    );
}
