import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import bronzenLogo from "../assets/logos/bronzen-logo.png";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function NavBar() {
    const { categorias } = useStateContext();

    const [activeIndex, setActiveIndex] = useState(null);
    const [loginView, setLoginView] = useState(true);
    const [signupView, setSignupView] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "",
        password: "",
        password_confirmation: "",
        email: "",
        cuit: "",
        direccion: "",
        provincia: "",
        localidad: "",
        descuento_general: "",
        descuento_adicional: 0,
        autorizado: 0,
    });

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
        formData.append("autorizado", userInfo?.autorizado);

        const response = axiosClient.post("/signup", formData);

        toast.promise(response, {
            loading: "Cargando...",
            success: "Registrado correctamente!",
            error: "Hubo un error al registrarse",
        });

        try {
            await response;
        } catch (error) {
            console.log(error);
        }
    };

    const soloPrimeraMayuscula = (string) => {
        if (!string) return "";
        const firstLetter = string.charAt(0).toUpperCase();
        const restOfString = string.slice(1).toLowerCase();
        return firstLetter + restOfString;
    };

    const categoriasSub = [...categorias]
        ?.sort((a, b) => {
            // Si ambos tienen orden, comparar por orden
            if (a?.orden && b?.orden) {
                return a.orden.localeCompare(b.orden);
            }
            // Si no, o si son iguales, ordenar por nombre
            return a?.name?.localeCompare(b?.name);
        })
        ?.map((categoria) => ({
            title: soloPrimeraMayuscula(categoria?.name),
            path: `productos/${categoria?.id}`,
        }));

    const links = [
        { title: "Novedades", path: "/novedades", subHref: [] },
        {
            title: "Nuestros Productos",
            path: "/productos",
            subHref: categoriasSub,
        },
        { title: "Catálogo", path: "/dashboard/productos", subHref: [] },
        { title: "Somos Bronzen", path: "/dashboard/clientes", subHref: [] },
        { title: "Contacto", path: "/contacto", subHref: [] },
    ];

    return (
        <header className="sticky top-0 bg-white h-[112px] my-2 flex justify-between items-center z-40">
            <nav className="w-[1200px] mx-auto flex flex-row justify-between items-center font-bold text-sm text-[#333]">
                <Link to={"/"}>
                    <img src={bronzenLogo} alt="Bronzen Logo" />
                </Link>
                <ul className="flex flex-row gap-8">
                    {links.map((link, index) => (
                        <li
                            key={index}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            className="relative py-2 flex flex-row gap-1 items-center"
                        >
                            <Link to={link.path}>
                                {link.title.toUpperCase()}
                            </Link>
                            {link.subHref.length > 0 && (
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    size="xs"
                                />
                            )}
                            <AnimatePresence>
                                {activeIndex === index &&
                                    link.subHref.length > 0 && (
                                        <motion.ul
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute min-w-[215px] top-9 flex flex-col gap-2 bg-white shadow-md p-6 w-max"
                                        >
                                            {link.subHref.map(
                                                (subLink, subIndex) => (
                                                    <li
                                                        key={subIndex}
                                                        className="text-[#999] text-[13px] font-normal hover:text-[#333] transition duration-300"
                                                    >
                                                        <Link to={subLink.path}>
                                                            {subLink.title}
                                                        </Link>
                                                    </li>
                                                )
                                            )}
                                        </motion.ul>
                                    )}
                            </AnimatePresence>
                        </li>
                    ))}
                    <AnimatePresence>
                        {(loginView || signupView) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed top-0 left-0 bg-black/50 w-screen h-screen"
                            ></motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <button
                            onClick={() => {
                                if (loginView || signupView) {
                                    setLoginView(false);
                                    setSignupView(false);
                                } else {
                                    setLoginView(true);
                                }
                            }}
                            className="font-bold w-[145px] h-[51px] border border-primary-orange text-primary-orange rounded-full hover:text-white hover:bg-primary-orange transition duration-300"
                        >
                            Zona privada
                        </button>
                        <AnimatePresence>
                            {loginView && (
                                <motion.div
                                    initial={{ y: -30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -30, opacity: 0 }}
                                    className="absolute bg-white flex justify-start items-start p-5 flex-col right-0 top-20 w-[367px] h-[439px] rounded-md shadow-lg gap-7"
                                >
                                    <h2 className="text-2xl">Iniciar Sesion</h2>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-[16px]"
                                            htmlFor="usuario"
                                        >
                                            Usuario
                                        </label>
                                        <input
                                            type="text"
                                            id="usuario"
                                            className="w-[327px] h-[45px] pl-3  rounded-full outline-1 outline-[#DDDDE0] focus:outline focus:outline-primary-orange transition duration-300"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-[16px]"
                                            htmlFor="password"
                                        >
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="w-[327px] h-[45px] pl-3  rounded-full outline-1 outline-[#DDDDE0] focus:outline focus:outline-primary-orange transition duration-300"
                                        />
                                    </div>
                                    <button className="w-[327px] h-[51px] bg-primary-orange text-white rounded-full">
                                        Iniciar sesion
                                    </button>
                                    <div className="bg-[#DDDDE0] h-[1px] w-full"></div>
                                    <div className="flex flex-row justify-center gap-3 w-full">
                                        <p>No estas registrado?</p>
                                        <button
                                            onClick={() => {
                                                setLoginView(false);
                                                setSignupView(true);
                                            }}
                                            className="text-primary-orange underline"
                                        >
                                            Regsitrate
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {signupView && (
                                <motion.div
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    className="absolute right-0 top-16 flex flex-col gap-2 rounded-md bg-white shadow-md p-5 font-roboto-condensed w-[600px] h-fit z-20 "
                                >
                                    <h2 className="font-bold text-[24px] py-5">
                                        Registrarse
                                    </h2>
                                    <form
                                        onSubmit={onSubmitSignup}
                                        className="w-full h-full flex flex-col gap-6"
                                    >
                                        <div className="grid grid-cols-2 gap-3 w-full text-[16px]">
                                            <div className="flex flex-col gap-2 col-span-2 ">
                                                <label
                                                    htmlFor="name"
                                                    className=""
                                                >
                                                    Nombre de usuario
                                                </label>
                                                <input
                                                    value={userInfo?.name}
                                                    onChange={(ev) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            name: ev.target
                                                                .value,
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
                                                            password:
                                                                ev.target.value,
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
                                                <label htmlFor="email">
                                                    Email
                                                </label>
                                                <input
                                                    value={userInfo.email}
                                                    onChange={(ev) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            email: ev.target
                                                                .value,
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
                                                <label htmlFor="dni">
                                                    Cuit
                                                </label>
                                                <input
                                                    value={userInfo?.cuit}
                                                    onChange={(ev) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            cuit: ev.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                                    type="text"
                                                    name="dni"
                                                    id="dni"
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2 col-span-2">
                                                <label htmlFor="direccion">
                                                    Dirección
                                                </label>
                                                <input
                                                    value={userInfo.direccion}
                                                    onChange={(ev) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            direccion:
                                                                ev.target.value,
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
                                                <label htmlFor="provincia">
                                                    Provincia
                                                </label>
                                                <select
                                                    required
                                                    value={userInfo.provincia}
                                                    onChange={(ev) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            provincia:
                                                                ev.target.value,
                                                            localidad: "",
                                                        })
                                                    }
                                                    className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                                    name="provincia"
                                                    id="provincia"
                                                >
                                                    <option value="">
                                                        Selecciona una provincia
                                                    </option>
                                                    <option value="test">
                                                        test
                                                    </option>
                                                    {/* {provincias.map(
                                                            (pr) => (
                                                                <option
                                                                    key={pr.id}
                                                                    value={
                                                                        pr.name
                                                                    }
                                                                >
                                                                    {pr.name}
                                                                </option>
                                                            )
                                                        )} */}
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
                                                            localidad:
                                                                ev.target.value,
                                                        })
                                                    }
                                                    className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                                    name="localidad"
                                                    id="localidad"
                                                >
                                                    <option value="">
                                                        Selecciona una localidad
                                                    </option>
                                                    <option value="test">
                                                        test
                                                    </option>
                                                    {/* {provincias
                                                            .find(
                                                                (pr) =>
                                                                    pr.name ===
                                                                    userSubmitInfo.provincia
                                                            )
                                                            ?.localidades.map(
                                                                (
                                                                    loc,
                                                                    index
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={
                                                                            loc.name
                                                                        }
                                                                    >
                                                                        {
                                                                            loc.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )} */}
                                                </select>
                                            </div>
                                        </div>
                                        <button className="col-span-2 text-white bg-primary-orange rounded-full w-full h-[43px]">
                                            Regsitrarse
                                        </button>
                                    </form>
                                    <div className="flex flex-row gap-3 justify-center items-center">
                                        <p>¿Ya tienes una cuenta?</p>
                                        <button
                                            type="button"
                                            className="text-primary-orange underline py-3"
                                            onClick={() => {
                                                setSignupView(false);
                                                setLoginView(true);
                                            }}
                                        >
                                            Iniciar Sesion
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </ul>
            </nav>
        </header>
    );
}
