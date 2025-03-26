import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function Footer() {
    const { contactInfo } = useStateContext();

    const contactLinks = [{ title: "s" }];

    const lineasLinks = [
        { title: "Aluminio" },
        { title: "Aluminio" },
        { title: "Cocina & Lavadero" },
        { title: "Aluminio" },
        { title: "Aluminio" },
        { title: "Cocina & Lavadero" },
        { title: "Aluminio" },
        { title: "Aluminio" },
    ];

    const informacionLinks = [
        {
            title: contactInfo?.mail,
            href: `mailto:${contactInfo?.mail}`,
            icon: faEnvelope,
        },
        {
            title: contactInfo?.phone,
            href: `tel:${contactInfo?.phone}`,
            icon: faPhone,
        },
        {
            title: contactInfo?.second_phone,
            href: `tel:${contactInfo?.second_phone}`,
            icon: faPhone,
        },
        {
            title: "WhatsApp",
            href: `https://wa.me/${contactInfo?.wp}`,
            icon: faWhatsapp,
        },
    ];

    return (
        <footer className="bg-[#d7d8da] text-[#62707b] h-[544px]">
            <div className="w-[1200px] mx-auto flex flex-col justify-between h-full">
                <div className="flex flex-col py-5 items-center">
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <h2 className="text-2xl text-center">
                            Estemos en contacto.
                        </h2>
                        <p className="text-sm text-center">
                            Suscribite a nuestro newsletter:
                        </p>
                        <div className="flex flex-row gap-3">
                            <input
                                type="text"
                                className="h-[30px] px-[.85rem] py-2 text-[14px] leading-[1.5] font-light text-[#62707b] bg-[#fafafa] border border-[#ebebeb] rounded-lg mb-2 transition duration-300 shadow-none w-[191px] placeholder:text-sm text-center placeholder:text-[#62707b] focus:outline-none focus:border focus:border-[#c96]"
                                placeholder="Nombre y apellido"
                            />
                            <input
                                type="text"
                                className="h-[30px] px-[.85rem] py-2 text-[14px] leading-[1.5] font-light text-[#62707b] bg-[#fafafa] border border-[#ebebeb] rounded-lg mb-2 transition duration-300 shadow-none w-[191px] placeholder:text-sm text-center placeholder:text-[#62707b] focus:outline-none focus:border focus:border-[#c96]"
                                placeholder="Tu e-mail"
                            />
                            <input
                                type="text"
                                className="h-[30px] px-[.85rem] py-2 text-[14px] leading-[1.5] font-light text-[#62707b] bg-[#fafafa] border border-[#ebebeb] rounded-lg mb-2 transition duration-300 shadow-none w-[191px] placeholder:text-sm text-center placeholder:text-[#62707b] focus:outline-none focus:border focus:border-[#c96]"
                                placeholder="Empresa"
                            />
                        </div>
                        <button className="text-white h-[30px] w-[194px] text-[14px]  rounded-[50px]  hover:shadow-md border border-[#ff9e19] hover:border hover:border-[#f3920d] hover:bg-[#f3920d] bg-[#ff9e19] transition">
                            ENVIAR
                        </button>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between w-full h-[192px]">
                        <div className="flex flex-col w-full gap-4">
                            <h2 className="font-semibold text-[#333333]">
                                Lineas
                            </h2>
                            <ul className="grid grid-cols-2 grid-rows-4 gap-y-2 w-full text-[#62707b] text-sm font-bold">
                                {lineasLinks.map((link, index) => (
                                    <Link
                                        className="hover:text-[#c96] transition duration-300"
                                        to={"#"}
                                        key={index}
                                    >
                                        {link.title}
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            <h2 className="font-semibold text-[#333333]">
                                Información
                            </h2>
                            <ul className="grid grid-cols-1 grid-rows-4 gap-y-2 w-full text-[#62707b] text-sm ">
                                <li>Nuestros Productos</li>
                                <li>Catálogo</li>
                                <li>Somos Bronzen</li>
                                <li>Contactanos</li>
                            </ul>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            <h2 className="font-semibold text-[#333333]">
                                Contacto
                            </h2>
                            <ul className="grid grid-cols-1 grid-rows-4 gap-y-2 w-full text-[#62707b] text-sm ">
                                {informacionLinks.map((link, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-row items-center justify-start gap-2"
                                    >
                                        <FontAwesomeIcon
                                            icon={link?.icon}
                                            color="#62707b"
                                            size="sm"
                                        />
                                        <a
                                            className="hover:text-[#c96] transition duration-300"
                                            href={link.href}
                                        >
                                            {link.title}
                                        </a>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <p className="text-right text-sm">
                        © 2025 BRONZEN S.A. Todos los derechos reservados.
                    </p>
                </div>

                <div className="flex flex-row justify-end w-full py-2 border-t border-gray-200">
                    <Link
                        className="hover:text-[#c92] transition duration-300"
                        to={"https://osole.com.ar/"}
                    >
                        by Osole
                    </Link>
                </div>
            </div>
        </footer>
    );
}
