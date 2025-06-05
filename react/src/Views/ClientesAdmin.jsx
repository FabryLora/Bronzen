import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import axiosClient from "../axios";
import UserAdmin from "../components/UserAdmin";
import { useStateContext } from "../context/ContextProvider";

export default function ClientesAdmin() {
    const {
        provincias,
        clientes,
        fetchClientes,
        fetchInformacion,
        informacion,
        vendedores,
        fetchVendedores,
    } = useStateContext();

    const [createView, setcreateView] = useState(false);
    const [descuentoView, setDescuentoView] = useState(false);
    const [descuentoGeneral, setDescuentoGeneral] = useState(
        informacion?.descuento_general
    );
    const [loading, setLoading] = useState();
    const [userInfo, setUserInfo] = useState({
        name: "",
        password: "",
        password_confirmation: "",
        email: "",
        cuit: "",
        direccion: "",
        provincia: "",
        localidad: "",
        telefono: "",
        descuento_general: 0,
        descuento_adicional: 0,
        descuento_adicional_2: 0,
        autorizado: 1,
        vendedor_id: "",
        tipo: "cliente",
    });

    useEffect(() => {
        fetchInformacion();
        fetchClientes();
        fetchVendedores();
    }, []);

    console.log(clientes);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredUsers = clientes?.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const onSubmitSignup = async (ev) => {
        ev.preventDefault();
        const formData = new FormData();
        formData.append("name", userInfo?.name);
        formData.append("password", userInfo?.password);
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
        formData.append(
            "descuento_adicional_2",
            userInfo?.descuento_adicional_2
        );
        formData.append("tipo", userInfo?.tipo);
        formData.append("autorizado", userInfo?.autorizado);
        formData.append("telefono", userInfo?.telefono);
        if (userInfo?.vendedor_id) {
            formData.append("vendedor_id", userInfo?.vendedor_id);
        } else {
            formData.append("vendedor_id", null);
        }

        const response = axiosClient.post("/signup", formData);

        toast.promise(response, {
            loading: "Cargando...",
            success: "Registrado correctamente!",
            error: "Hubo un error al registrarse",
        });

        try {
            await response;
            setcreateView(false);
            fetchClientes();
        } catch (error) {
            console.log(error);
        }
    };

    const changeDescuento = async () => {
        const formData = new FormData();
        formData.append("descuento_general", descuentoGeneral);
        const response = adminAxiosClient.post(
            "/informacion/1?_method=PUT",
            formData
        );
        toast.promise(response, {
            loading: "Cargando...",
            success: "Descuento actualizado correctamente!",
            error: "Hubo un error al actualizar el descuento",
        });
        try {
            await response;
            setDescuentoView(false);
            fetchInformacion();
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
                                Registrar Cliente
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
                                        <label htmlFor="telefono" className="">
                                            Telefono
                                        </label>
                                        <input
                                            value={userInfo?.telefono}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    telefono: ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="text"
                                            name="telefono"
                                            id="telefono"
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
                                            required
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
                                            required
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

                                    <div className="flex flex-col gap-2 ">
                                        <label htmlFor="descuento_adicional_2">
                                            Descuento adicional 2
                                        </label>
                                        <input
                                            value={
                                                userInfo?.descuento_adicional_2
                                            }
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    descuento_adicional_2:
                                                        ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px] pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            type="text"
                                            name="descuento_adicional_2"
                                            id="descuento_adicional_2"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
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

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="tipo">Vendedor</label>
                                        <select
                                            value={userInfo.vendedor_id}
                                            onChange={(ev) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    vendedor_id:
                                                        ev.target.value,
                                                })
                                            }
                                            className="w-full h-[45px] pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                            name="tipo"
                                            id="tipo"
                                        >
                                            <option value="" selected>
                                                Selecciona un vendedor
                                            </option>
                                            {vendedores?.map((vendedor) => (
                                                <option
                                                    key={vendedor.id}
                                                    value={vendedor.id}
                                                >
                                                    {vendedor.name}
                                                </option>
                                            ))}
                                        </select>
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
                                        onClick={() => setcreateView(false)}
                                        type="button"
                                        className=" text-white bg-red-500 rounded-full w-full h-[43px] font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button className=" text-white bg-primary-orange rounded-full w-full h-[43px] font-bold">
                                        Registrar Cliente
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {descuentoView && (
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
                                Actualizar descuento general
                            </h2>
                            <div className="flex flex-col gap-2 ">
                                <label htmlFor="descuento_adicional">
                                    Descuento General
                                </label>
                                <input
                                    defaultValue={
                                        informacion?.descuento_general
                                    }
                                    onChange={(ev) =>
                                        setDescuentoGeneral(ev.target.value)
                                    }
                                    className="w-full h-[45px] pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                    type="text"
                                    name="descuento_adicional"
                                    id="descuento_adicional"
                                    required
                                />
                                <div className="col-span-2 h-[0.5px] my-2 bg-gray-200 "></div>
                                <div className="col-span-2 flex flex-row gap-4">
                                    <button
                                        onClick={() => setDescuentoView(false)}
                                        type="button"
                                        className=" text-white bg-red-500 rounded-full w-full h-[43px] font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={changeDescuento}
                                        className=" text-white bg-primary-orange rounded-full w-full h-[43px] font-bold"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                    Clientes
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
                        Registrar cliente
                    </button>
                    <button
                        onClick={() => setDescuentoView(true)}
                        className="text-white bg-primary-orange font-bold py-1 px-2 rounded-md w-[400px]"
                    >
                        Actualizar descuento general
                    </button>
                </div>
                <div>
                    <p>
                        <span className="text-lg text-gray-400">
                            Descuento general:
                        </span>{" "}
                        <span className="text-green-500">
                            {informacion?.descuento_general}%
                        </span>
                    </p>
                </div>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border">
                    <thead className="text-sm  text-black bg-gray-300 uppercase">
                        <tr className="">
                            <th scope="col" className="pl-4 py-3">
                                Usuario
                            </th>
                            <th scope="col" className=" py-3">
                                Email
                            </th>

                            <th scope="col" className=" py-3">
                                Provincia
                            </th>
                            <th scope="col" className=" py-3">
                                Localidad
                            </th>

                            <th scope="col" className=" py-3 text-center">
                                Vendedor
                            </th>
                            <th scope="col" className=" py-3 text-center">
                                Autorizado
                            </th>
                            <th scope="col" className=" py-3 text-center">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {filteredUsers
                            .slice(
                                (currentPage - 1) * itemsPerPage,
                                currentPage * itemsPerPage
                            )
                            .map((user) => (
                                <UserAdmin key={user?.id} user={user} />
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
                                Math.min(prev + 1, totalPages)
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
