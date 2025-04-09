import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import axiosClient from "../axios";
import Switch from "../components/Switch";
import { useStateContext } from "../context/ContextProvider";

export default function UserAdmin({ user }) {
    const { fetchClientes, provincias } = useStateContext();
    const [error, setError] = useState(null);
    const [succ, setSucc] = useState(false);
    const [submiting, setSubmiting] = useState(false);
    const [updateView, setUpdateView] = useState(false);

    const [userInfo, setUserInfo] = useState({
        name: user?.name,
        password: "",
        password_confirmation: "",
        email: user?.email,
        cuit: user?.cuit,
        direccion: user?.direccion,
        provincia: user?.provincia,
        localidad: user?.localidad,
        descuento_general: user?.descuento_general,
        descuento_adicional: user?.descuento_adicional,
        autorizado: user?.autorizado,
    });

    const onSubmitSignup = async (ev) => {
        ev.preventDefault();
        const formData = new FormData();
        formData.append("name", userInfo?.name);
        if (userInfo?.password) formData.append("password", userInfo?.password);
        if (userInfo?.password_confirmation)
            formData.append(
                "password_confirmation",
                userInfo?.password_confirmation
            );
        formData.append("email", userInfo?.email);
        formData.append("cuit", userInfo?.cuit);
        formData.append("direccion", userInfo?.direccion);
        formData.append("provincia", userInfo?.provincia);
        formData.append("localidad", userInfo?.localidad);
        formData.append("descuento_general", userInfo?.descuento_general);
        formData.append("descuento_adicional", userInfo?.descuento_adicional);
        formData.append("autorizado", userInfo?.autorizado);

        const response = adminAxiosClient.post(
            `/clientes/${user?.id}?_method=PUT`,
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
            fetchClientes();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUser = () => {
        adminAxiosClient
            .delete(`/clientes/${user?.id}`)
            .then(() => {
                fetchClientes();
                toast.success("Usuario eliminado correctamente");
            })
            .catch(() => {
                toast.error("Error al eliminar el usuario");
            });
    };

    return (
        <tr className={`border text-black odd:bg-gray-100 even:bg-white`}>
            <td className="h-[90px] pl-4 font-bold text-base">{user?.name}</td>
            <td>{user?.email}</td>

            <td>{user?.provincia}</td>
            <td>{user?.localidad}</td>
            <td
                className={`text-center ${
                    user?.descuento_adicional > 0
                        ? "text-green-500"
                        : "text-gray-500"
                }`}
            >
                {user?.descuento_adicional}%
            </td>
            <td className="text-center flex justify-center items-center h-[90px]">
                <Switch
                    id={user?.id}
                    path={"/clientes"}
                    initialEnabled={user?.autorizado === 1 ? true : false}
                />
            </td>
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
                                Actualizar Cliente
                            </h2>
                            <form
                                onSubmit={onSubmitSignup}
                                className="w-full h-full flex flex-col gap-6"
                            >
                                <div className="grid grid-cols-2 gap-3 w-full text-[16px]">
                                    <div className="flex flex-col gap-2 col-span-2 ">
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
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="password">
                                            Contraseña
                                        </label>
                                        <input
                                            value={userInfo.password}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    password: ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="password"
                                            name="password"
                                            id="password"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="password_confirmation">
                                            Confirmar contraseña
                                        </label>
                                        <input
                                            value={
                                                userInfo.password_confirmation
                                            }
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    password_confirmation:
                                                        ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="password"
                                            name="password_confirmation"
                                            id="password_confirmation"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            value={userInfo.email}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    email: ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="dni">Cuit</label>
                                        <input
                                            value={userInfo?.cuit}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    cuit: ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="text"
                                            name="dni"
                                            id="dni"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 ">
                                        <label htmlFor="direccion">
                                            Dirección
                                        </label>
                                        <input
                                            value={userInfo.direccion}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    direccion: ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px] pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="text"
                                            name="direccion"
                                            id="direccion"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 ">
                                        <label htmlFor="descuento_adicional">
                                            Descuento adicional
                                        </label>
                                        <input
                                            value={
                                                userInfo?.descuento_adicional
                                            }
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    descuento_adicional:
                                                        ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px] pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="text"
                                            name="descuento_adicional"
                                            id="descuento_adicional"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="provincia">
                                            Provincia
                                        </label>
                                        <select
                                            required
                                            value={userInfo.provincia}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    provincia: ev.target.value,
                                                    localidad: "",
                                                })
                                            }
                                            className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            name="provincia"
                                            id="provincia"
                                        >
                                            <option disabled selected value="">
                                                Selecciona una provincia
                                            </option>

                                            {provincias.map((pr) => (
                                                <option
                                                    key={pr.id}
                                                    value={pr.name}
                                                >
                                                    {pr.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="localidad">
                                            Localidad
                                        </label>
                                        <select
                                            required
                                            value={userInfo.localidad}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    localidad: ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            name="localidad"
                                            id="localidad"
                                        >
                                            <option disabled selected value="">
                                                Selecciona una localidad
                                            </option>

                                            {provincias
                                                .find(
                                                    (pr) =>
                                                        pr.name ===
                                                        userInfo?.provincia
                                                )
                                                ?.localidades.map(
                                                    (loc, index) => (
                                                        <option
                                                            key={index}
                                                            value={loc.name}
                                                        >
                                                            {loc.name}
                                                        </option>
                                                    )
                                                )}
                                        </select>
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
                                        Actualizar Cliente
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
