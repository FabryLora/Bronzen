import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axiosClient from "../axios";
import VendedorRow from "../Components/VendedorRow";
import { useStateContext } from "../context/ContextProvider";

export default function VendedoresAdmin() {
    const { vendededores, fetchVendedores, clientes, fetchClientes } =
        useStateContext();
    const [createView, setcreateView] = useState(false);

    const [loading, setLoading] = useState();
    const [userInfo, setUserInfo] = useState({
        name: "",
    });

    useEffect(() => {
        fetchVendedores();
        fetchClientes();
    }, []);

    console.log(vendededores);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredUsers = vendededores?.filter((user) =>
        user?.name?.toLowerCase()?.includes(search?.toLowerCase())
    );

    const totalPages = Math?.ceil(filteredUsers?.length / itemsPerPage);
    const paginatedUsers = filteredUsers?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const onSubmitSignup = async (ev) => {
        ev.preventDefault();
        const formData = new FormData();
        formData.append("name", userInfo?.name);

        const response = axiosClient.post("/vendedores", formData);

        toast.promise(response, {
            loading: "Cargando...",
            success: "Registrado correctamente!",
            error: "Hubo un error al registrarse",
        });

        try {
            await response;
            setcreateView(false);
            fetchVendedores();
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="w-[1200px] max-sm:w-full mx-auto h-screen flex justify-center items-center">
                <PulseLoader color="#ff6600" />
            </div>
        );
    }

    return (
        <div className="h-screen px-6 py-10">
            <Toaster />
            <AnimatePresence>
                {createView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="flex flex-col gap-2 rounded-md bg-white shadow-md p-5 font-roboto-condensed w-[600px] h-fit z-20 "
                        >
                            <h2 className="font-bold text-[24px] py-5">
                                Registrar Vendedor
                            </h2>
                            <form
                                onSubmit={onSubmitSignup}
                                className="w-full h-full flex flex-col gap-6"
                            >
                                <div className="grid grid-cols-1 gap-3 w-full text-[16px]">
                                    <div className="flex flex-col gap-2  ">
                                        <label htmlFor="name" className="">
                                            Nombre de usuario
                                        </label>
                                        <input
                                            value={userInfo?.name}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    name: ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 h-[0.5px] bg-gray-200 "></div>
                                <div className="col-span-2 flex flex-row gap-4">
                                    <button
                                        onClick={() => setcreateView(false)}
                                        type="button"
                                        className=" text-white bg-red-500 rounded-full w-full h-[43px] font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button className=" text-white bg-primary-orange rounded-full w-full h-[43px] font-bold">
                                        Registrar Vendedor
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-2">
                <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                    Vendedores
                </h2>
                <div className="flex flex-row gap-5 w-full h-fit py-2">
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // Resetear la paginación al filtrar
                        }}
                        className=" pl-2 py-1 border rounded w-full"
                    />
                    <button
                        onClick={() => setcreateView(true)}
                        className="text-white bg-primary-orange font-bold py-1 px-2 rounded-md w-[300px]"
                    >
                        Registrar Vendedor
                    </button>
                </div>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border">
                    <thead className="text-sm  text-black bg-gray-300 uppercase">
                        <tr className="">
                            <th scope="col" className="pl-4 py-3">
                                Nombre
                            </th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {filteredUsers
                            ?.slice(
                                (currentPage - 1) * itemsPerPage,
                                currentPage * itemsPerPage
                            )
                            ?.map((user) => (
                                <VendedorRow key={user?.id} user={user} />
                            ))}
                    </tbody>
                </table>
                <div className="flex justify-center  text-black py-4 ">
                    <button
                        className="px-3 py-1 mx-1 border rounded disabled:opacity-50"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        className="px-3 py-1 mx-1 border rounded disabled:opacity-50"
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math?.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
