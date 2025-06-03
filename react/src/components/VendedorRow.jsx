import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";
import Switch from "./Switch";

export default function VendedorRow({ user }) {
    const { fetchVendedores, provincias } = useStateContext();
    const [error, setError] = useState(null);
    const [succ, setSucc] = useState(false);
    const [submiting, setSubmiting] = useState(false);
    const [updateView, setUpdateView] = useState(false);

    const [userInfo, setUserInfo] = useState({
        name: user?.name,
        vendedor_id: user?.vendedor_id,
    });

    const onSubmitSignup = async (ev) => {
        ev.preventDefault();
        const formData = new FormData();
        formData.append("name", userInfo?.name);
        formData.append("vendedor_id", userInfo?.vendedor_id);

        const response = adminAxiosClient.post(
            `/vendedores/${user?.id}?_method=PUT`,
            formData
        );

        toast.promise(response, {
            loading: "Cargando...",
            success: "Registrado correctamente!",
            error: "Hubo un error al registrarse",
        });

        try {
            await response;
            setUpdateView(false);
            fetchVendedores();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUser = () => {
        adminAxiosClient
            .delete(`/vendedores/${user?.id}`)
            .then(() => {
                fetchVendedores();
                toast.success("Usuario eliminado correctamente");
            })
            .catch(() => {
                toast.error("Error al eliminar el usuario");
            });
    };

    return (
        <tr className={`border text-black odd:bg-gray-100 even:bg-white`}>
            <td className="h-[90px] pl-4 font-bold text-base">{user?.name}</td>
            <td>{user?.name}</td>

            <td>{user?.vendedor_id}</td>

            <td>
                <div className="flex flex-row gap-3 justify-center">
                    <button
                        onClick={() => setUpdateView(true)}
                        className="border-blue-500 border py-1 px-2 text-white rounded-md w-10 h-10"
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            size="lg"
                            color="#3b82f6"
                        />
                    </button>
                    <button
                        onClick={deleteUser}
                        className="border-[#bc1d31] border py-1 px-2 text-white rounded-md w-10 h-10"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            size="lg"
                            color="#bc1d31"
                        />
                    </button>
                </div>
            </td>
            <AnimatePresence>
                {updateView && (
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
                                Actualizar Vendedor
                            </h2>
                            <form
                                onSubmit={onSubmitSignup}
                                className="w-full h-full flex flex-col gap-6"
                            >
                                <div className="grid grid-cols-2 gap-3 w-full text-[16px]">
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

                                    <div className="flex flex-col gap-2  ">
                                        <label htmlFor="name" className="">
                                            Vendedor ID
                                        </label>
                                        <input
                                            value={userInfo?.vendedor_id}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    vendedor_id:
                                                        ev.target.value,
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
                                        onClick={() => setUpdateView(false)}
                                        type="button"
                                        className=" text-white bg-red-500 rounded-full w-full h-[43px] font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button className=" text-white bg-primary-orange rounded-full w-full h-[43px] font-bold">
                                        Actualizar Vendedor
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </tr>
    );
}
