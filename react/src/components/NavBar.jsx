import { faBars, faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bronzenLogo from "../assets/logos/bronzen-logo.png";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";
import InstallPWA from "./InstallPWA";

export default function NavBar() {
    const {
        categorias,
        setCurrentUser,
        setUserToken,
        currentUser,
        userToken,
        provincias,
        catalogo,
        setVendedorView,
    } = useStateContext();

    const location = useLocation();

    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(null);
    const [loginView, setLoginView] = useState(false);
    const [signupView, setSignupView] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "",
        password: "",
        password_confirmation: "",
        email: "",
        cuit: "",
        direccion: "",
        provincia: "",
        localidad: "",
        descuento_general: 0,
        descuento_adicional: 0,
        autorizado: 0,
        telefono: "",
    });
    const [loginMobileView, setloginMobileView] = useState(false);
    const [signupMobileView, setSignupMobileView] = useState(false);
    const [mobileSideBar, setMobileSideBar] = useState(false);

    const [name, setName] = useState();
    const [password, setPassword] = useState();

    const userRef = useRef(null);
    const userSignRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setLoginView(false);
                setSignupView(false);
            }

            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setMobileSideBar(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 50); // Cambia cuando baja 50px
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const login = async (ev) => {
        ev.preventDefault();

        try {
            // Crear una referencia a la petición
            const request = axiosClient.post("/login", {
                name,
                password,
            });

            // Usar toast.promise para mostrar los estados del proceso
            toast.promise(request, {
                loading: "Iniciando sesión...",
                success: "Sesión iniciada correctamente",
                error: (err) => {
                    // Si hay mensaje de error específico del servidor
                    if (err.response?.data?.message) {
                        return `Error: ${err.response.data.message}`;
                    }
                    // Si hay errores de validación
                    if (err.response?.data?.errors) {
                        const errorMessages = Object.values(
                            err.response.data.errors
                        )
                            .flat()
                            .join(", ");
                        return `Error: ${errorMessages}`;
                    }
                    // Mensaje genérico
                    return "Error al iniciar sesión";
                },
            });

            // Esperar la respuesta
            const { data } = await request;

            // Actualizar estado con datos del usuario
            setCurrentUser(data.user);
            if (data.user?.tipo == "vendedor") {
                setVendedorView(true);
            }
            setUserToken(data.token);

            // Puedes hacer redirección aquí si es necesario
            // navigate('/dashboard');
        } catch (error) {
            console.error("Error completo:", error);

            // Puedes manejar errores específicos aquí
            if (error.response?.status === 401) {
                // Credenciales incorrectas
                console.log("Credenciales incorrectas");
                // Podrías actualizar un estado para mostrar este error específico
                // setLoginError("Nombre de usuario o contraseña incorrectos");
            } else if (error.response?.data?.errors) {
                // Errores de validación
                const validationErrors = error.response.data.errors;
                console.log("Errores de validación:", validationErrors);
                // setFormErrors(validationErrors);
            }
        }
    };

    const logout = async (ev) => {
        ev.preventDefault();
        axiosClient
            .post("/logout")
            .then(({ data }) => {
                setCurrentUser(null);
                setUserToken(null);
                // Redirect to admin dashboard or other admin page
            })
            .catch((error) => {
                console.error(error);
            });
    };

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
        formData.append("telefono", userInfo?.telefono);

        // Crear una referencia a la promesa pero no esperar todavía
        const request = axiosClient.post("/signup", formData);

        try {
            // Usar toast.promise para mostrar los estados de carga
            toast.promise(request, {
                loading: "Cargando...",
                success:
                    "Registrado correctamente!. Validaremos tu cuenta en breve.",
                error: (err) => {
                    // Si hay errores de validación, mostrarlos específicamente
                    if (err.response?.data?.errors) {
                        // Puedes retornar un mensaje más específico basado en los errores
                        const errorMessages = Object.values(
                            err.response.data.errors
                        )
                            .flat()
                            .join(", ");
                        return `Error: ${errorMessages}`;
                    }
                    // Mensaje de error genérico
                    return "Hubo un error al registrarse";
                },
            });

            // Esperar la respuesta
            const response = await request;
            console.log("Registro exitoso:", response.data);
            setSignupView(false);
        } catch (error) {
            console.log("Error completo:", error);

            // Aquí puedes manejar los errores de forma adicional
            // Por ejemplo, actualizar el estado para mostrar los errores en la UI
            if (error.response?.data?.errors) {
                // Actualizar el estado con los errores para mostrarlos en el formulario
                const serverErrors = error.response.data.errors;
                console.log("Errores de validación:", serverErrors);

                // Si tienes un estado para almacenar errores, puedes actualizarlo aquí
                // setErrors(serverErrors);
            }
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
    let links = [];

    if (userToken) {
        links = [
            { title: "PRODUCTOS", path: "/privado/productos", subHref: [] },
            {
                title: "PEDIDOS/PRESUPUESTOS",
                path: "/privado/pedidos",
                subHref: [],
            },
            {
                title: "MIS PEDIDOS",
                path: "/privado/mis-pedidos",
                subHref: [],
            },
            { title: "MIS FACTURAS", path: "/privado/facturas", subHref: [] },
        ];
    } else {
        links = [
            { title: "Novedades", path: "/novedades", subHref: [] },
            {
                title: "Nuestros Productos",
                path: "/productos",
                subHref: categoriasSub,
            },
            { title: "Catálogo", path: "#", subHref: [] },
            {
                title: "Somos Bronzen",
                path: "##",
                subHref: [],
            },
            { title: "Contacto", path: "/contacto", subHref: [] },
        ];
    }

    const scrollToSection = () => {
        // Primero navegamos a la ruta raíz
        navigate("/");

        // Usamos setTimeout para asegurarnos de que el DOM se ha actualizado después de la navegación
        // Esto es importante porque el elemento puede no existir inmediatamente después de navegar
        setTimeout(() => {
            const element = document.getElementById("targetSection");
            if (element) {
                // Calcular la posición del elemento
                const elementPosition = element.getBoundingClientRect().top;
                // Posición actual de desplazamiento
                const offsetPosition = elementPosition + window.pageYOffset;

                // Desplazarse a la posición con un offset de 80px
                window.scrollTo({
                    top: offsetPosition - 80, // 80px por encima del elemento
                    behavior: "smooth",
                });
            } else {
                console.log("Elemento no encontrado después de la navegación");
            }
        }, 100); // Un pequeño retraso para asegurar que el DOM está actualizado
    };

    const handleDownload = async () => {
        try {
            const filename = catalogo?.file.split("/").pop();
            // Make a GET request to the download endpoint
            const response = await axiosClient.get(
                `/catalogo/download/${filename}`,
                {
                    responseType: "blob", // Important for file downloads
                }
            );

            // Create a link element to trigger the download
            const fileType =
                response.headers["content-type"] || "application/octet-stream";
            const blob = new Blob([response.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "Catalogo"; // Descargar con el nombre original
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);

            // Optional: show user-friendly error message
            alert("Failed to download the file. Please try again.");
        }
    };

    return (
        <header
            className={`sticky top-0 bg-white flex justify-between items-center z-40 max-sm:h-[84px] ${
                scroll ? "h-[80px] shadow-md" : "h-[112px]"
            } transition-all duration-300`}
        >
            <nav className=" w-[1200px] max-sm:w-full max-sm:px-4 mx-auto flex flex-row justify-between max-sm:justify-start items-center font-bold text-sm text-[#333]">
                <div className="relative flex flex-row  justify-between w-full sm:hidden">
                    <div className="flex flex-row gap-4 items-center ">
                        <button
                            onClick={() => setMobileSideBar(!mobileSideBar)}
                            className="sm:hidden"
                        >
                            <FontAwesomeIcon
                                icon={faBars}
                                size="xl"
                                color="#666666"
                            />
                        </button>
                        <Link className="" to={"/"}>
                            <img
                                className="w-[120px] h-[22px]"
                                src={bronzenLogo}
                                alt="Bronzen Logo"
                            />
                        </Link>
                    </div>
                    <button
                        onClick={() => {
                            if (loginView || signupView) {
                                setLoginView(false);
                                setSignupView(false);
                                setloginMobileView(false);
                            } else {
                                setLoginView(true);
                                setloginMobileView(true);
                            }
                        }}
                        className={`font-bold w-[99px] h-[35px] border text-xs border-primary-orange text-primary-orange rounded-full hover:text-white hover:bg-primary-orange transition duration-300 ${
                            userToken ? "bg-primary-orange text-white" : ""
                        }`}
                    >
                        {userToken
                            ? currentUser?.name?.toUpperCase()
                            : "Zona privada"}
                    </button>
                    <AnimatePresence>
                        {loginMobileView && !userToken && (
                            <motion.div
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -30, opacity: 0 }}
                                className={`absolute bg-white flex justify-start max-sm:items-center items-start p-5 flex-col top-14 -right-4 w-screen h-screen shadow-lg gap-10 sm:hidden ${
                                    userToken ? "h-fit" : ""
                                }`}
                            >
                                <div className="w-full flex justify-end">
                                    <button
                                        onClick={() =>
                                            setloginMobileView(false)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faX}
                                            size="sm"
                                            color="#5B6670"
                                        />
                                    </button>
                                </div>
                                <h2 className="text-2xl">Iniciar Sesion</h2>
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-[16px]"
                                        htmlFor="usuarioo"
                                    >
                                        Usuario
                                    </label>
                                    <input
                                        value={name}
                                        onChange={(ev) =>
                                            setName(ev.target.value)
                                        }
                                        type="text"
                                        id="usuarioo"
                                        className="w-[327px] h-[45px] pl-3  rounded-full outline-1 outline-[#DDDDE0] focus:outline focus:outline-primary-orange transition duration-300"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-[16px]"
                                        htmlFor="passwordd"
                                    >
                                        Contraseña
                                    </label>
                                    <input
                                        value={password}
                                        onChange={(ev) =>
                                            setPassword(ev.target.value)
                                        }
                                        type="password"
                                        id="passwordd"
                                        className="w-[327px] h-[45px] pl-3  rounded-full outline-1 outline-[#DDDDE0] focus:outline focus:outline-primary-orange transition duration-300"
                                    />
                                </div>
                                <button
                                    onClick={login}
                                    className="w-[327px] h-[51px] bg-primary-orange text-white rounded-full"
                                >
                                    Iniciar sesion
                                </button>

                                <div className="bg-[#DDDDE0] h-[1px] w-full"></div>
                                <div className="flex flex-col items-center justify-center gap-3 w-full">
                                    <p>¿No tenés usuario?</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setloginMobileView(false);
                                            setSignupMobileView(true);
                                        }}
                                        className="text-primary-orange underline"
                                    >
                                        Registrate
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {signupMobileView && !userToken && (
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="absolute w-screen h-screen top-10 -right-4 flex flex-col gap-2 rounded-md bg-white shadow-md p-5 font-roboto-condensed z-20 "
                            >
                                <div className="w-full flex justify-end">
                                    <button
                                        onClick={() =>
                                            setSignupMobileView(false)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faX}
                                            size="sm"
                                            color="#5B6670"
                                        />
                                    </button>
                                </div>
                                <h2 className="font-bold text-[24px] py-5">
                                    Registrarse
                                </h2>
                                <form
                                    onSubmit={onSubmitSignup}
                                    className="w-full h-fit flex flex-col gap-6"
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
                                                <option
                                                    disabled
                                                    selected
                                                    value=""
                                                >
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
                                                        localidad:
                                                            ev.target.value,
                                                    })
                                                }
                                                className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                                name="localidad"
                                                id="localidad"
                                            >
                                                <option
                                                    disabled
                                                    selected
                                                    value=""
                                                >
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
                                    <button className="col-span-2 text-white bg-primary-orange rounded-full w-full h-[43px]">
                                        Regsitrarse
                                    </button>
                                </form>
                                <div className="flex flex-row max-sm:flex-col max-sm:gap-0 max-sm:py-4 gap-3 justify-center items-center">
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
                    <AnimatePresence>
                        {mobileSideBar && (
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ ease: "linear", duration: 0.2 }}
                                className="absolute top-[59px] -left-4 w-screen h-screen z-10 flex justify-start items-center "
                            >
                                <div
                                    ref={sidebarRef}
                                    className="h-screen w-[80%] bg-[#333333] text-white pt-20"
                                >
                                    <div className="flex flex-row justify-between border-b border-primary-orange px-4 py-3">
                                        {userToken && (
                                            <>
                                                <div className="  w-full ">
                                                    <p className="font-bold text-[14px]">
                                                        {userToken
                                                            ? currentUser?.name?.toUpperCase()
                                                            : "Zona Privada"}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={logout}
                                                    className="text-[14px] font-bold text-primary-orange"
                                                >
                                                    Salir
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        {links.map((link, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col gap-2 px-4 py-3 border-b border-[#434343]"
                                            >
                                                {link?.path == "#" ||
                                                link?.path == "##" ? (
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                link?.path ==
                                                                "#"
                                                            ) {
                                                                handleDownload();
                                                            } else {
                                                                setMobileSideBar(
                                                                    false
                                                                );

                                                                scrollToSection();
                                                            }
                                                        }}
                                                        className="text-[12px] text-left font-normal"
                                                    >
                                                        {link?.title}
                                                    </button>
                                                ) : (
                                                    <Link
                                                        onClick={() =>
                                                            mobileSideBar(false)
                                                        }
                                                        to={link?.path}
                                                        className="text-[12px] font-normal"
                                                    >
                                                        {link?.title}
                                                    </Link>
                                                )}

                                                {link?.subHref?.length > 0 && (
                                                    <ul className="flex flex-col gap-2">
                                                        {link?.subHref?.map(
                                                            (
                                                                subLink,
                                                                subIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        subIndex
                                                                    }
                                                                    className="text-[#999] text-[13px] font-normal hover:text-[#333] transition duration-300"
                                                                >
                                                                    <Link
                                                                        to={
                                                                            subLink.path
                                                                        }
                                                                    >
                                                                        {
                                                                            subLink.title
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                        <InstallPWA />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Link className="max-sm:hidden" to={"/"}>
                    <img className="" src={bronzenLogo} alt="Bronzen Logo" />
                </Link>

                <ul className="flex flex-row gap-8 max-sm:hidden">
                    {links.map((link, index) => (
                        <li
                            key={index}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            className="relative py-2 flex flex-row gap-1 items-center"
                        >
                            {link.path == "#" || link?.path == "##" ? (
                                <button
                                    onClick={() => {
                                        if (link?.path == "#") {
                                            handleDownload();
                                        } else {
                                            scrollToSection();
                                        }
                                    }}
                                >
                                    {link.title.toUpperCase()}
                                </button>
                            ) : (
                                <Link to={link.path}>
                                    {link.title.toUpperCase()}
                                </Link>
                            )}

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

                    <div ref={userRef} className="relative">
                        <button
                            onClick={() => {
                                if (loginView || signupView) {
                                    setLoginView(false);
                                    setSignupView(false);
                                } else {
                                    setLoginView(true);
                                }
                            }}
                            className={`font-bold w-[145px] h-[51px] border border-primary-orange text-primary-orange rounded-full hover:text-white hover:bg-primary-orange transition duration-300 ${
                                userToken ? "bg-primary-orange text-white" : ""
                            }`}
                        >
                            {userToken
                                ? currentUser?.name?.toUpperCase()
                                : "Zona privada"}
                        </button>
                        <AnimatePresence>
                            {loginView && (
                                <motion.form
                                    initial={{ y: -30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -30, opacity: 0 }}
                                    className={`absolute bg-white flex justify-start items-start p-5 flex-col right-0 top-20 w-[367px] h-fit rounded-md shadow-lg gap-7 ${
                                        userToken ? "h-fit" : ""
                                    }`}
                                >
                                    {userToken ? (
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-2xl">
                                                Bienvenido, {currentUser?.name}{" "}
                                                !
                                            </h2>
                                            <p className="text-[16px]">
                                                {currentUser?.email}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-2xl">
                                                Iniciar Sesion
                                            </h2>

                                            <div className="flex flex-col gap-2">
                                                <label
                                                    className="text-[16px]"
                                                    htmlFor="usuario"
                                                >
                                                    Usuario
                                                </label>
                                                <input
                                                    value={name}
                                                    onChange={(ev) =>
                                                        setName(ev.target.value)
                                                    }
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
                                                    value={password}
                                                    onChange={(ev) =>
                                                        setPassword(
                                                            ev.target.value
                                                        )
                                                    }
                                                    type="password"
                                                    id="password"
                                                    className="w-[327px] h-[45px] pl-3  rounded-full outline-1 outline-[#DDDDE0] focus:outline focus:outline-primary-orange transition duration-300"
                                                />
                                            </div>
                                            <button
                                                onClick={login}
                                                className="w-[327px] h-[51px] bg-primary-orange text-white rounded-full"
                                            >
                                                Iniciar sesion
                                            </button>
                                        </>
                                    )}

                                    {userToken && (
                                        <div className="w-full flex flex-col gap-3">
                                            {currentUser?.tipo ==
                                                "vendedor" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setVendedorView(true)
                                                    }
                                                    className="w-[327px] h-[51px] bg-primary-orange text-white rounded-full"
                                                >
                                                    Menu de vendedor
                                                </button>
                                            )}

                                            <button
                                                onClick={logout}
                                                className="w-[327px] h-[51px] bg-red-500 text-white rounded-full"
                                            >
                                                Cerrar Sesion
                                            </button>
                                        </div>
                                    )}
                                    {!userToken && (
                                        <>
                                            <div className="bg-[#DDDDE0] h-[1px] w-full"></div>
                                            <div className="flex flex-row justify-center gap-3 w-full">
                                                <p>No estas registrado?</p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLoginView(false);
                                                        setSignupView(true);
                                                    }}
                                                    className="text-primary-orange underline"
                                                >
                                                    Registrate
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </motion.form>
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
                                            <div className="flex flex-col gap-2 ">
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
                                            <div className="flex flex-col gap-2  ">
                                                <label
                                                    htmlFor="telefono"
                                                    className=""
                                                >
                                                    Telefono
                                                </label>
                                                <input
                                                    value={userInfo?.telefono}
                                                    onChange={(ev) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            telefono:
                                                                ev.target.value,
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
                                                    <option
                                                        disabled
                                                        selected
                                                        value=""
                                                    >
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
                                                            localidad:
                                                                ev.target.value,
                                                        })
                                                    }
                                                    className="w-full h-[45px]  pl-3 rounded-full outline-1 outline-[#DDDDE0] focus:outline-primary-orange transition duration-300"
                                                    name="localidad"
                                                    id="localidad"
                                                >
                                                    <option
                                                        disabled
                                                        selected
                                                        value=""
                                                    >
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
                                                                    value={
                                                                        loc.name
                                                                    }
                                                                >
                                                                    {loc.name}
                                                                </option>
                                                            )
                                                        )}
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
