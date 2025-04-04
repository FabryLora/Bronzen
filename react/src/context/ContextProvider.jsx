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
    somosBronzenInicio: {},
    fetchSomosBronzenInicio: () => {},
    catalogo: {},
    fetchCatalogo: () => {},
    categorias: [],
    fetchCategorias: () => {},
    subCategorias: [],
    fetchSubCategorias: () => {},
    productos: [],
    fetchProductos: () => {},
    subProductos: [],
    fetchSubProductos: () => {},
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
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
    const [somosBronzenInicio, setSomosBronzenInicio] = useState({});
    const [catalogo, setCatalogo] = useState({});
    const [categorias, setCategorias] = useState([]);
    const [subCategorias, setSubCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [subProductos, setSubProductos] = useState([]);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const addToCart = (product, additionalInfo) => {
        setCart((prevCart) => {
            const exists = prevCart.find((item) => item.id === product.id);

            let updatedCart;

            if (exists) {
                updatedCart = prevCart.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              additionalInfo: {
                                  cantidad: additionalInfo.cantidad,
                                  subtotal: additionalInfo.subtotal,
                              },
                          }
                        : item
                );
            } else {
                updatedCart = [...prevCart, { ...product, additionalInfo }];
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.id !== productId);

        setCart(updatedCart);
    };

    const clearCart = () => {
        setCart([]); // Vaciar el estado del carrito
        localStorage.removeItem("cart"); // Eliminar el carrito del localStorage
    };

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

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
            setLogos(data.data);
        });
    };

    const fetchBannerInicio = () => {
        axiosClient.get("/banner-inicio").then(({ data }) => {
            setBannerInicio(data.data);
        });
    };

    const fetchContactInfo = () => {
        axiosClient.get("/contact-info").then(({ data }) => {
            setContactInfo(data.data);
        });
    };

    const fetchSomosBronzenInicio = () => {
        axiosClient.get("/somos-bronzen-inicio").then(({ data }) => {
            setSomosBronzenInicio(data.data);
        });
    };

    const fetchCatalogo = () => {
        axiosClient.get("/catalogo").then(({ data }) => {
            setCatalogo(data.data);
        });
    };

    const fetchCategorias = () => {
        axiosClient.get("/categorias").then(({ data }) => {
            setCategorias(data.data);
        });
    };

    const fetchSubCategorias = () => {
        axiosClient.get("/sub-categorias").then(({ data }) => {
            setSubCategorias(data.data);
        });
    };

    const fetchProductos = () => {
        axiosClient.get("/productos").then(({ data }) => {
            setProductos(data.data);
        });
    };

    const fetchSubProductos = () => {
        axiosClient.get("/sub-productos").then(({ data }) => {
            setSubProductos(data.data);
        });
    };

    useEffect(() => {
        fetchSubCategorias();
        fetchLogos();
        fetchBannerInicio();
        fetchContactInfo();
        fetchSomosBronzenInicio();
        fetchCatalogo();
        fetchCategorias();
    }, []);

    return (
        <StateContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                subProductos,
                fetchSubProductos,
                productos,
                fetchProductos,
                subCategorias,
                fetchSubCategorias,
                categorias,
                fetchCategorias,
                catalogo,
                fetchCatalogo,
                somosBronzenInicio,
                fetchSomosBronzenInicio,
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
