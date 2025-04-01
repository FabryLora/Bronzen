import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Links } from "react-router-dom";
import contactoImage from "../assets/contacto/contacto.png";
import background from "../assets/inicio/bg-somos-bronzen.jpg";
import { useStateContext } from "../context/ContextProvider";

export default function Contacto() {
    const { contactInfo } = useStateContext();
    const [nombre, setNombre] = useState();
    const [apellido, setApellido] = useState();
    const [email, setEmail] = useState();
    const [area, setArea] = useState();
    const [consulta, setConsulta] = useState();

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
            title: "Whatsapp",
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
                        <form
                            className="grid grid-cols-2 gap-x-6 gap-y-5 w-full max-w-[574px] text-sm text-[#62707b]"
                            method="POST"
                        >
                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                type="text"
                                className="placeholder:text-gray-500 rounded-[10px]  px-[20px]  bg-white w-[277px] h-[30px] focus:outline-1 focus:outline-primary-orange transition duration-300"
                                placeholder="Nombre *"
                            />
                            <input
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                type="text"
                                className="placeholder:text-gray-500 rounded-[10px] py-[8.5px] px-[20px] bg-white w-[277px] h-[30px] focus:outline-1 focus:outline-primary-orange transition duration-300"
                                placeholder="Apellido *"
                            />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="placeholder:text-gray-500 rounded-[10px]  px-[20px] bg-white w-[277px] h-[30px] focus:outline-1 focus:outline-primary-orange transition duration-300"
                                placeholder="Email *"
                            />
                            <select
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="placeholder:text-gray-500 rounded-[10px]  px-[20px] bg-white w-[277px] h-[30px] focus:outline-1 focus:outline-primary-orange transition duration-300"
                            >
                                <option value="area de interes">
                                    Area de Interés
                                </option>
                                <option value="venras">Ventas</option>
                                <option value="informacion">Información</option>
                                <option value="pagos">Pagos</option>
                                <option value="pedidos">Pedidos</option>
                            </select>
                            <textarea
                                value={consulta}
                                onChange={(e) => setConsulta(e.target.value)}
                                className="placeholder:text-gray-500 col-span-2  rounded-[10px] py-[8.5px] px-[20px] bg-white w-full h-[120px] focus:outline-1 focus:outline-primary-orange transition duration-300"
                                placeholder="Ingresa aquí tu consulta *"
                            ></textarea>
                            <div className="col-span-2 flex justify-center mt-2">
                                <button
                                    type="submit"
                                    className="bg-primary-orange text-white rounded-[30px] h-[30px] px-[30px] w-[100px] font-medium flex justify-center items-center"
                                >
                                    ENVIAR
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="w-full h-full flex items-center">
                        <img
                            src={contactoImage}
                            className="w-[500px] h-[500px]"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
