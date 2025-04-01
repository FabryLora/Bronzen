import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "./Views/AdminLogin";
import Administrator from "./Views/Administrator";
import CatalogoAdmin from "./Views/CatalogoAdmin";
import CategoriasAdmin from "./Views/CategoriasAdmin";
import Contacto from "./Views/Contacto";
import ContactoAdmin from "./Views/ContactoAdmin";
import Contenido from "./Views/Contenido";
import DefaultLayout from "./Views/DefaultLayout";
import ExcelUploader from "./Views/ExcelUploader";
import Home from "./Views/Home";
import Novedades from "./Views/Novedades";
import ProductosAdmin from "./Views/ProductosAdmin";
import {
    default as SomosBronzen,
    default as SomosBronzenAdmin,
} from "./Views/SomosBronzenAdmin";
import SubCategoriasAdmin from "./Views/SubCategoriasAdmin";
import SubirProductos from "./Views/SubirProductos";

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
            {
                path: "/dashboard/excel",
                element: <SubirProductos />,
            },
            {
                path: "/dashboard/categorias",
                element: <CategoriasAdmin />,
            },
            {
                path: "/dashboard/sub-categorias",
                element: <SubCategoriasAdmin />,
            },
            {
                path: "/dashboard/productos",
                element: <ProductosAdmin />,
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
            {
                path: "/novedades",
                element: <Novedades />,
            },
        ],
    },
]);

export default router;
