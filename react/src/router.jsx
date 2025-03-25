import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "./Views/AdminLogin";
import Administrator from "./Views/Administrator";
import ContactoAdmin from "./Views/ContactoAdmin";
import Contenido from "./Views/Contenido";
import DefaultLayout from "./Views/DefaultLayout";
import Home from "./Views/Home";

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
        ],
    },
]);

export default router;
