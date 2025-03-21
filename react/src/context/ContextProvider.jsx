import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios";

const StateContext = createContext({
    user: null,
    admin: null,
    token: null,
    adminToken: null,
    setUser: () => {},
    setAdmin: () => {},
    setToken: () => {},
    setAdminToken: () => {},
    userLogin: () => {},
    adminLogin: () => {},
    userLogout: () => {},
    adminLogout: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [token, _setToken] = useState(localStorage.getItem("TOKEN") || "");
    const [adminToken, _setAdminToken] = useState(
        localStorage.getItem("ADMIN_TOKEN") || ""
    );
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    // Funciones para gestionar tokens
    const setToken = (newToken) => {
        if (newToken) {
            localStorage.setItem("TOKEN", newToken);
        } else {
            localStorage.removeItem("TOKEN");
        }
        _setToken(newToken);
    };

    const setAdminToken = (newToken) => {
        if (newToken) {
            localStorage.setItem("ADMIN_TOKEN", newToken);
            localStorage.setItem("IS_ADMIN", "true");
        } else {
            localStorage.removeItem("ADMIN_TOKEN");
            localStorage.removeItem("IS_ADMIN");
        }
        _setAdminToken(newToken);
    };

    // Funciones de autenticación para usuarios
    const userLogin = async (nomcuit, password, remember = false) => {
        setLoading(true);
        setErrors(null);

        try {
            const { data } = await axiosClient.post("/login", {
                nomcuit: nomcuit,
                password: password,
                remember: remember,
            });

            setToken(data.token);
            setUser(data.user);
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data.error) {
                const errorMessage = error.response.data.error;
                if (
                    errorMessage === "The provided credentials are not correct"
                ) {
                    setErrors(
                        "Las credenciales proporcionadas son incorrectas."
                    );
                } else if (
                    errorMessage ===
                    "Your account is not authorized. Please contact support."
                ) {
                    setErrors("Tu cuenta no está autorizada.");
                } else {
                    setErrors(
                        "Ocurrió un error inesperado. Inténtalo de nuevo."
                    );
                }
            } else {
                setErrors(
                    "Ocurrió un problema con la conexión. Inténtalo nuevamente."
                );
            }
            throw error;
        }
    };

    // Funciones de autenticación para administradores
    const adminLogin = async (name, password) => {
        setLoading(true);
        setErrors(null);

        try {
            const { data } = await axiosClient.post("/admin/login", {
                email: email,
                password: password,
            });

            setAdminToken(data.token);
            setAdmin(data.admin);
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data.error) {
                setErrors("Las credenciales de administrador son incorrectas.");
            } else {
                setErrors(
                    "Ocurrió un problema con la conexión. Inténtalo nuevamente."
                );
            }
            throw error;
        }
    };

    // Funciones para cerrar sesión
    const userLogout = async () => {
        try {
            await axiosClient.post("/logout");
        } catch (error) {
            console.error("Error during logout:", error);
        }

        setUser(null);
        setToken(null);
    };

    const adminLogout = async () => {
        try {
            await axiosClient.post("/admin/logout");
        } catch (error) {
            console.error("Error during admin logout:", error);
        }

        setAdmin(null);
        setAdminToken(null);
    };

    // Cargar información del usuario o administrador al iniciar sesión
    useEffect(() => {
        if (token) {
            axiosClient
                .get("/me")
                .then(({ data }) => {
                    setUser(data);
                })
                .catch((error) => {
                    console.error("Error loading user:", error);
                    setToken(null);
                });
        }

        /* if (adminToken) {
            axiosClient
                .get("/admin/me")
                .then(({ data }) => {
                    setAdmin(data.admin);
                })
                .catch((error) => {
                    console.error("Error loading admin:", error);
                    setAdminToken(null);
                });
        } */
    }, [token, adminToken]);

    const contextValue = {
        user,
        admin,
        token,
        adminToken,
        setUser,
        setAdmin,
        setToken: setToken,
        setAdminToken: setAdminToken,
        userLogin,
        adminLogin,
        userLogout,
        adminLogout,
        loading,
        errors,
    };

    return (
        <StateContext.Provider value={contextValue}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
