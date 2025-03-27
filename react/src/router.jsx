import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "./Views/AdminLogin";
import Administrator from "./Views/Administrator";
import CatalogoAdmin from "./Views/CatalogoAdmin";
import Contacto from "./Views/Contacto";
import ContactoAdmin from "./Views/ContactoAdmin";
import Contenido from "./Views/Contenido";
import DefaultLayout from "./Views/DefaultLayout";
import Home from "./Views/Home";
import {
    default as SomosBronzen,
    default as SomosBronzenAdmin,
} from "./Views/SomosBronzenAdmin";

const router = createBrowserRouter([
    {
        path: "/adm",
        element: <AdminLogin />,
    },
    {
        path: "/dashboard",
        element: <Administrator />,
        children: [
            {
                path: "/dashboard/contenido",
                element: <Contenido />,
            },
            {
                path: "/dashboard/contacto",
                element: <ContactoAdmin />,
            },
            {
                path: "/dashboard/somos-bronzen",
                element: <SomosBronzenAdmin />,
            },
            {
                path: "/dashboard/catalogo",
                element: <CatalogoAdmin />,
            },
        ],
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/contacto",
                element: <Contacto />,
            },
        ],
    },
]);

export default router;
