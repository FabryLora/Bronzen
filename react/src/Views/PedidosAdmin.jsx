import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import PedidosRowAdmin from "../components/PedidosRowAdmin";
import { useStateContext } from "../context/ContextProvider";

export default function PedidosAdmin() {
    const { pedidos, clientes, fetchClientes, fetchPedidos } =
        useStateContext();

    useEffect(() => {
        fetchPedidos();
        fetchClientes();
    }, []);

    const [numeroDePedido, setNumeroDePedido] = useState("");
    const [cliente, setCliente] = useState("");

    const pedidosFiltrados = pedidos?.filter(
        (pedido) =>
            (numeroDePedido === "" ||
                pedido?.id?.toString().includes(numeroDePedido)) &&
            (cliente === "" ||
                clientes
                    ?.find((user) => user.id === pedido?.user_id)
                    ?.nomcuit?.toLowerCase()
                    .includes(cliente.toLowerCase()))
    );

    return (
        <div>
            <Toaster />

            <div className="grid w-full px-20 py-20">
                <div className="flex flex-row gap-5 py-2">
                    <input
                        placeholder="Numero de pedido"
                        className="border p-2"
                        type="text"
                        value={numeroDePedido}
                        onChange={(e) => setNumeroDePedido(e.target.value)}
                    />
                    <input
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                        placeholder="Cliente"
                        className="border p-2"
                        type="text"
                    />
                </div>

                <div className="grid grid-cols-4 items-center justify-items-center bg-[#F5F5F5] h-[52px] font-semibold">
                    <p>Numero de Pedido</p>
                    <p>Cliente</p>
                    <p>Estado</p>
                    <p>Ver Pedido</p>
                </div>

                <div className="max-h-[800px] overflow-y-auto">
                    {pedidosFiltrados?.map((pedido, index) => (
                        <PedidosRowAdmin key={index} pedidoObject={pedido} />
                    ))}
                </div>
            </div>
        </div>
    );
}
