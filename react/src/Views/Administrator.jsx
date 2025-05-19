import {
    faBars,
    faBoxArchive,
    faChevronRight,
    faEnvelope,
    faGear,
    faHouse,
    faLock,
    faNewspaper,
    faShield,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
    Link,
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";
import adminAxiosClient from "../adminAxiosClient";
import bronzenLogo from "../assets/logos/bronzen-logo.png";
import { useStateContext } from "../context/ContextProvider";

export default function Administrator() {
    const {
        adminToken,
        setAdminToken,
        currentAdmin,
        setCurrentAdmin,
        fetchAllAdmins,
        fetchMetadatos,
    } = useStateContext();

    useEffect(() => {
        adminAxiosClient
            .get("/me")
            .then(({ data }) => {
                setCurrentAdmin(data);
            })
            .catch((error) => {
                console.error("Error during fetching admin data:", error);
            });
        fetchAllAdmins();
        fetchMetadatos();
    }, []);

    const [sidebar, setSidebar] = useState(true);
    const navigate = useNavigate();

    const MotionFontAwesomeIcon = motion.create(FontAwesomeIcon);
    const MotionLink = motion.create(Link);

    const location = useLocation();

    const cleanPathname = location.pathname
        .replace(/^\/+/, "")
        .replace(/-/g, " ")
        .split("/");

    cleanPathname.shift();

    const finalPath = cleanPathname.join("/");

    const [dropdowns, setDropdowns] = useState([
        {
            id: "inicio",
            open: false,
            title: "Inicio",
            icon: faHouse,
            href: "#",
            subHref: [{ title: "Contenido", href: "/dashboard/contenido" }],
        },

        {
            id: "nuestros-productos",
            open: false,
            title: "Nuestros Productos",
            icon: faBoxArchive,
            href: "#",
            subHref: [
                { title: "Categorias", href: "/dashboard/categorias" },
                { title: "Sub-categorias", href: "/dashboard/sub-categorias" },
                {
                    title: "Productos",
                    href: "/dashboard/productos",
                },
                { title: "Sub-productos", href: "/dashboard/sub-productos" },
            ],
        },
        {
            id: "catalogo",
            open: false,
            title: "Catalogo",
            icon: faEnvelope,
            href: "/dashboard/catalogo",
            subHref: [],
        },
        {
            id: "somos-bronzen",
            open: false,
            title: "Somos Bronzen",
            icon: faUsers,
            href: "/dashboard/somos-bronzen",
            subHref: [],
        },
        {
            id: "contacto",
            open: false,
            title: "Contacto",
            icon: faEnvelope,
            href: "/dashboard/contacto",
            subHref: [
                { title: "Contacto", href: "/dashboard/contacto" },
                { title: "Newsletter", href: "/dashboard/newsletter" },
            ],
        },
        {
            id: "zonaprivada",
            open: false,
            title: "Zona Privada",
            icon: faLock,
            href: "#",
            subHref: [
                { title: "Clientes", href: "/dashboard/clientes" },

                {
                    title: "Mis Pedidos",
                    href: "/dashboard/mis-pedidos",
                },
                {
                    title: "Informacion y descuento",
                    href: "/dashboard/informacion",
                },
            ],
        },

        {
            id: "administradores",
            open: false,
            title: "Administradores",
            icon: faShield,
            href: "/dashboard/administradores",
            subHref: [],
        },
        {
            id: "metadatos",
            open: false,
            title: "Metadatos",
            icon: faGear,
            href: "/dashboard/metadatos",
            subHref: [],
        },
    ]);

    const [userMenu, setUserMenu] = useState(false);

    const toggleDropdown = (id) => {
        setDropdowns((prevDropdowns) =>
            prevDropdowns.map((drop) => ({
                ...drop,
                open: drop.id === id ? !drop.open : false,
            }))
        );
    };

    const logout = () => {
        // Crear la promesa
        const logoutPromise = adminAxiosClient.post("/logout");

        // Aplicar toast.promise a la promesa
        toast.promise(logoutPromise, {
            loading: "Cerrando sesión...",
            success: "Sesión cerrada correctamente",
            error: "Error al cerrar sesión",
        });

        // Manejo de la promesa
        logoutPromise
            .then((response) => {
                setCurrentAdmin({});
                setAdminToken(null);
                navigate("/adm");
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                // Incluso si hay error, podemos intentar cerrar sesión localmente
                setCurrentAdmin({});
                setAdminToken(null);
                navigate("/adm");
            });
    };

    if (!adminToken) {
        return <Navigate to={"/adm"} />;
    }

    return (
        <div className="flex flex-row font-red-hat">
            <Toaster />
            <AnimatePresence>
                {sidebar && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ ease: "linear", duration: 0.2 }}
                        className="flex flex-col h-screen w-[300px] bg-white text-black overflow-y-auto scrollbar-hide"
                    >
                        <Link to={"/"} className="w-full p-6">
                            <img
                                className="w-full h-full object-cover"
                                src={bronzenLogo}
                                alt=""
                            />
                        </Link>
                        <nav className="">
                            <ul className="">
                                <AnimatePresence>
                                    {dropdowns.map((drop) => (
                                        <li key={drop.id}>
                                            <button
                                                onClick={() => {
                                                    if (drop.subHref == false) {
                                                        navigate(drop.href);
                                                    }
                                                    toggleDropdown(drop.id);
                                                }}
                                                className="flex flex-row w-full justify-between items-center  p-4"
                                            >
                                                <div className="flex flex-row gap-2 items-center">
                                                    <button
                                                        type="button"
                                                        className="w-4  h-4 flex items-center justify-center"
                                                    >
                                                        <FontAwesomeIcon
                                                            size="sm"
                                                            icon={drop.icon}
                                                            color="#ff9e19"
                                                        />
                                                    </button>

                                                    <Link to={drop.href}>
                                                        {drop.title}
                                                    </Link>
                                                </div>
                                                {drop.subHref != false && (
                                                    <MotionFontAwesomeIcon
                                                        animate={{
                                                            rotate: drop.open
                                                                ? 90
                                                                : 0,
                                                        }}
                                                        transition={{
                                                            ease: "linear",
                                                            duration: 0.1,
                                                        }}
                                                        size="xs"
                                                        icon={faChevronRight}
                                                    />
                                                )}
                                            </button>
                                            <AnimatePresence>
                                                {drop.open &&
                                                    drop.subHref != false && (
                                                        <ul className="flex flex-col gap-2 overflow-hidden py-2 h-fit border-l border-primary-orange ml-6">
                                                            {drop.subHref.map(
                                                                (
                                                                    sub,
                                                                    index
                                                                ) => (
                                                                    <Link
                                                                        className="mx-4 px-2 py-1 rounded-full hover:bg-primary-orange hover:text-white transition duration-200"
                                                                        key={
                                                                            index
                                                                        }
                                                                        to={
                                                                            sub.href
                                                                        }
                                                                    >
                                                                        {
                                                                            sub.title
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                            </AnimatePresence>
                                        </li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="w-full flex flex-col overflow-y-auto h-screen bg-[#f5f5f5]">
                <div className="sticky top-0 bg-white shadow-md py-3 flex flex-row justify-between items-center px-6 z-50">
                    <div className="flex flex-row gap-3">
                        <button onClick={() => setSidebar(!sidebar)}>
                            <FontAwesomeIcon
                                icon={faBars}
                                size="lg"
                                color="#000"
                            />
                        </button>
                        <h1 className="text-2xl">
                            {finalPath.charAt(0).toUpperCase() +
                                finalPath.slice(1) || "Bienvenido al Dashboard"}
                        </h1>
                    </div>

                    <div className="flex flex-row gap-3">
                        <div className="">
                            <h2 className="font-medium  ">
                                {currentAdmin?.name?.toUpperCase()}
                            </h2>
                        </div>
                        <button
                            className="relative"
                            onClick={() => setUserMenu(!userMenu)}
                        >
                            <FontAwesomeIcon color="#000" icon={faUser} />
                        </button>
                        <AnimatePresence>
                            {userMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{
                                        duration: 0.1,
                                        ease: "linear",
                                    }}
                                    className="flex flex-col items-start absolute border-2 shadow- w-[300px] h-fit right-2 top-10 p-4 bg-white gap-4 "
                                >
                                    <button
                                        onClick={logout}
                                        className="bg-primary-gray text-white w-full h-[40px]"
                                    >
                                        Cerrar Sesion
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
