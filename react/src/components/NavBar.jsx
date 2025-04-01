import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import bronzenLogo from "../assets/logos/bronzen-logo.png";
import { useStateContext } from "../context/ContextProvider";

export default function NavBar() {
    const { categorias } = useStateContext();

    const [activeIndex, setActiveIndex] = useState(null);

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
            path: "/dashboard/categorias",
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
                    <button className="font-bold w-[145px] h-[51px] border border-primary-orange text-primary-orange rounded-full hover:text-white hover:bg-primary-orange transition duration-300">
                        Zona privada
                    </button>
                </ul>
            </nav>
        </header>
    );
}
