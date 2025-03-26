import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios";

const StateContext = createContext({
    currentUser: null,
    userToken: null,
    setCurrentUser: () => {},
    setUserToken: () => {},
    // Admin context
    currentAdmin: null,
    adminToken: null,
    setCurrentAdmin: () => {},
    setAdminToken: () => {},
    logos: {},
    fetchLogos: () => {},
    bannerInicio: {},
    fetchBannerInicio: () => {},
    contactInfo: {},
    fetchContactInfo: () => {},
});

export const ContextProvider = ({ children }) => {
    // User state
    const [currentUser, setCurrentUser] = useState({});
    const [userToken, _setUserToken] = useState(
        localStorage.getItem("TOKEN") || ""
    );

    // Admin state
    const [currentAdmin, setCurrentAdmin] = useState({});
    const [adminToken, _setAdminToken] = useState(
        localStorage.getItem("ADMIN_TOKEN") || ""
    );

    const [logos, setLogos] = useState({});
    const [bannerInicio, setBannerInicio] = useState({});
    const [contactInfo, setContactInfo] = useState({});

    // User token handlers
    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem("TOKEN", token);
        } else {
            localStorage.removeItem("TOKEN");
        }
        _setUserToken(token);
    };

    // Admin token handlers
    const setAdminToken = (token) => {
        if (token) {
            localStorage.setItem("ADMIN_TOKEN", token);
        } else {
            localStorage.removeItem("ADMIN_TOKEN");
        }
        _setAdminToken(token);
    };

    const fetchLogos = () => {
        axiosClient.get("/logos").then(({ data }) => {
            setLogos(data.data[0]);
        });
    };

    const fetchBannerInicio = () => {
        axiosClient.get("/banner-inicio").then(({ data }) => {
            setBannerInicio(data.data[0]);
        });
    };

    const fetchContactInfo = () => {
        axiosClient.get("/contact-info").then(({ data }) => {
            setContactInfo(data.data[0]);
        });
    };

    useEffect(() => {
        fetchLogos();
        fetchBannerInicio();
        fetchContactInfo();
    }, []);

    return (
        <StateContext.Provider
            value={{
                contactInfo,
                fetchContactInfo,
                bannerInicio,
                fetchBannerInicio,
                logos,
                fetchLogos,
                currentUser,
                setCurrentUser,
                userToken,
                setUserToken,

                currentAdmin,
                setCurrentAdmin,
                adminToken,
                setAdminToken,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
