import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Links } from "react-router-dom";
import background from "../assets/inicio/bg-somos-bronzen.jpg";
import { useStateContext } from "../context/ContextProvider";

export default function Contacto() {
    const { contactInfo } = useStateContext();

    const links = [
        {
            icon: faPhone,
            href: `tel:${contactInfo?.phone}`,
            title: contactInfo?.phone,
        },
        {
            icon: faPhone,
            href: `tel:${contactInfo?.second_phone}`,
            title: contactInfo?.second_phone,
        },
        {
            icon: faEnvelope,
            href: `mailto:${contactInfo?.mail}`,
            title: contactInfo?.mail,
        },
        {
            icon: faWhatsapp,
            href: `https://wa.me/${contactInfo?.wp}`,
            title: contactInfo?.wp,
        },
    ];

    return (
        <div
            style={{ backgroundImage: `url(${background})` }}
            className="h-[903px] bg-no-repeat bg-cover bg-top bg-center"
        >
            <div className="w-[1200px] mx-auto h-full py-20">
                <div className="flex flex-row h-full">
                    <div className="w-full flex flex-col text-white gap-10">
                        <h1 className="text-5xl  font-bold">CONTACTO</h1>
                        <div className="flex flex-col gap-5">
                            <h2 className="text-2xl">
                                Estamos para responder tus consultas.
                            </h2>
                            <p className="text-sm">
                                Bronzen comercializa sus productos únicamente a
                                través de distribuidores.
                            </p>
                            <p className="text-sm">
                                Podés contactarte utilizando los siguientes
                                canales:
                            </p>
                            <div className="flex flex-col gap-2">
                                {links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link?.href}
                                        className="flex flex-row gap-1 items-center text-sm"
                                    >
                                        <FontAwesomeIcon
                                            icon={link?.icon}
                                            size="sm"
                                        />
                                        <span>{link?.title}</span>
                                    </a>
                                ))}
                            </div>
                            <p className="text-sm">
                                O completá el formulario y nos pondremos en
                                contacto a la brevedad.
                            </p>
                        </div>
                    </div>

                    <div className="w-full"></div>
                </div>
            </div>
        </div>
    );
}
