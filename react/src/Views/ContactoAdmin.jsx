import { faSquareWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import AdminButton from "../Components/AdminButton";
import { useStateContext } from "../context/ContextProvider";

export default function ContactoAdmin() {
    const { contactInfo, fetchContactInfo } = useStateContext();

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const [mail, setMail] = useState(contactInfo?.mail);
    const [phone, setPhone] = useState(contactInfo?.phone);
    const [wp, setWp] = useState(contactInfo?.wp);
    const [secondPhone, setsecondPhone] = useState(contactInfo?.second_phone);

    useState(() => {
        setMail(contactInfo?.mail);
        setPhone(contactInfo?.phone);
        setWp(contactInfo?.wp);
        setsecondPhone(contactInfo?.second_phone);
    }, [contactInfo]);

    const submit = async (ev) => {
        ev.preventDefault();

        const formData = new FormData();
        formData.append("mail", mail);
        formData.append("phone", phone);
        formData.append("wp", wp);
        formData.append("second_phone", secondPhone);

        const response = adminAxiosClient.post(
            "/contact-info/1?_method=PUT",
            formData
        );

        toast.promise(response, {
            loading: "Guardando cambios...",
            success: "Cambios guardados",
            error: "Ocurrió un error",
        });

        try {
            await response;
            fetchContactInfo();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Toaster />
            <form
                onSubmit={submit}
                className="p-5 flex flex-col gap-5 h-screen"
            >
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-8 max-sm:grid-cols-1 ">
                            <div className="flex flex-row w-full gap-2">
                                <div className="w-full">
                                    <label
                                        htmlFor="username"
                                        className="flex flex-row gap-2 items-center text-sm/6 font-medium text-gray-900"
                                    >
                                        <FontAwesomeIcon
                                            color="#ff9e19"
                                            icon={faEnvelope}
                                            size="lg"
                                        />
                                        <p>Mail</p>
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-orange">
                                            <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                            <input
                                                value={mail}
                                                onChange={(ev) => {
                                                    setMail(ev.target.value);
                                                }}
                                                id="username"
                                                name="username"
                                                type="text"
                                                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label
                                    htmlFor="wp"
                                    className="flex flex-row items-center gap-2 text-sm/6 font-medium text-gray-900"
                                >
                                    <FontAwesomeIcon
                                        icon={faSquareWhatsapp}
                                        size="xl"
                                        color="#ff9e19"
                                    />
                                    <p>WhatsApp</p>
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300  focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-orange">
                                        <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                        <input
                                            value={wp}
                                            onChange={(ev) => {
                                                setWp(ev.target.value);
                                            }}
                                            id="wp"
                                            name="username"
                                            type="text"
                                            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <label
                                    htmlFor="telefono"
                                    className="flex flex-row gap-2 items-center text-sm/6 font-medium text-gray-900"
                                >
                                    <FontAwesomeIcon
                                        color="#ff9e19"
                                        icon={faPhone}
                                        size={"lg"}
                                    />
                                    <p>Telefono</p>
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-orange">
                                        <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                        <input
                                            value={phone}
                                            onChange={(ev) => {
                                                setPhone(ev.target.value);
                                            }}
                                            id="telefono"
                                            name="username"
                                            type="text"
                                            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <label
                                    htmlFor="telefono2"
                                    className="flex flex-row gap-2 items-center text-sm/6 font-medium text-gray-900"
                                >
                                    <FontAwesomeIcon
                                        icon={faPhone}
                                        size={"lg"}
                                        color="#ff9e19"
                                    />
                                    <p>Telefono {`(2)`}</p>
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-orange">
                                        <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                        <input
                                            value={secondPhone}
                                            onChange={(ev) => {
                                                setsecondPhone(ev.target.value);
                                            }}
                                            id="telefono2"
                                            name="telefono2"
                                            type="text"
                                            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-start">
                    <AdminButton text="Actualizar" />
                </div>
            </form>
        </>
    );
}
