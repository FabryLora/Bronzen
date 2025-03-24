import { createContext, useContext, useState } from "react";

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

    return (
        <StateContext.Provider
            value={{
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
