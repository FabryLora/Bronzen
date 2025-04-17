import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import adminAxiosClient from "../adminAxiosClient";
import bronzenLogo from "../assets/logos/bronzen-logo.png";
import { useStateContext } from "../context/ContextProvider";

export default function AdminLogin() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [login, setLogin] = useState(false);

    const { setAdminToken, setCurrentAdmin, adminToken } = useStateContext();

    const onSubmit = async (ev) => {
        ev.preventDefault();

        try {
            // Guarda la promesa en una variable
            const responsePromise = adminAxiosClient.post("/login", {
                name: user,
                password,
            });

            // Muestra el toast con la promesa
            toast.promise(responsePromise, {
                loading: "Iniciando sesión...",
                success: "Sesión iniciada",
                error: "Error al iniciar sesión",
            });

            // Espera a que se resuelva la promesa y guarda el resultado
            const response = await responsePromise;
            console.log(response.data);

            // Ahora puedes acceder a response.data.admin correctamente
            setCurrentAdmin(response.data.admin);
            setAdminToken(response.data.token);
        } catch (error) {
            console.error(error);
        }
    };

    if (adminToken) {
        return <Navigate to={"/dashboard"} />;
    }

    return (
        <div className="flex flex-col gap-10 justify-center items-center w-screen h-screen bg-black/50 bg-opacity-50 fixed top-0 left-0 z-10">
            <Toaster />
            <div className="flex flex-col top-10 right-10 bg-white shadow-md p-5 font-roboto-condensed w-fit h-fit z-20 rounded-lg">
                {error && (
                    <div className="bg-red-500 text-white text-center p-2 rounded-md">
                        {error}
                    </div>
                )}
                <Link className="self-center py-5" to={"/"}>
                    <img src={bronzenLogo} alt="" />
                </Link>

                <form
                    onSubmit={onSubmit}
                    className="w-fit h-full flex flex-col justify-around gap-8 "
                    action=""
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold" htmlFor="user">
                                Usuario
                            </label>
                            <input
                                value={user}
                                onChange={(ev) => setUser(ev.target.value)}
                                className="w-[328px] h-[45px]  pl-3 outline outline-gray-300 focus:outline-primary-orange transition duration-300 rounded-full"
                                type="text"
                                name="user"
                                id="user"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                                className="w-[328px] h-[45px]  pl-3 outline outline-gray-300 focus:outline-primary-orange transition duration-300 rounded-full"
                                type="password"
                                name="password"
                                id="password"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-300 w-full h-[0.5px]"></div>

                    <button
                        className="w-[325px] h-[47px] bg-primary-orange font-bold rounded-full text-white self-center "
                        type="submit"
                    >
                        {login ? "Iniciando Sesion..." : "Iniciar Sesion"}
                    </button>
                </form>
            </div>
        </div>
    );
}
