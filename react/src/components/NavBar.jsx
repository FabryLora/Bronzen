import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import bronzenLogo from "../assets/logos/bronzen-logo.png";

export default function NavBar() {
    const [activeIndex, setActiveIndex] = useState(null);

    const links = [
        { title: "Novedades", path: "/novedades", subHref: [] },
        {
            title: "Nuestros Productos",
            path: "/dashboard/categorias",
            subHref: [
                { title: "Categorías", path: "/dashboard/categorias" },
                { title: "Subcategoría 1", path: "/dashboard/subcategoria1" },
                { title: "Subcategoría 2", path: "/dashboard/subcategoria2" },
            ],
        },
        { title: "Catálogo", path: "/dashboard/productos", subHref: [] },
        { title: "Somos Bronzen", path: "/dashboard/clientes", subHref: [] },
        { title: "Contacto", path: "/dashboard/administradores", subHref: [] },
    ];

    return (
        <header className="sticky top-0 bg-white h-[112px] my-2 flex justify-between items-center z-40">
            <nav className="w-[1200px] mx-auto flex flex-row justify-between items-center font-bold text-sm text-[#333]">
                <div>
                    <img src={bronzenLogo} alt="Bronzen Logo" />
                </div>
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
                                            className="absolute top-9 border flex flex-col gap-2 bg-white shadow-md p-5 w-max"
                                        >
                                            {link.subHref.map(
                                                (subLink, subIndex) => (
                                                    <li
                                                        key={subIndex}
                                                        className="text-[#999] text-[13px] hover:text-[#333] transition duration-300"
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
