import { createBrowserRouter } from "react-router-dom";
import Administrator from "./Views/Administrator";
import AdminLogin from "./Views/AdminLogin";
import CatalogoAdmin from "./Views/CatalogoAdmin";
import CategoriasAdmin from "./Views/CategoriasAdmin";
import Contacto from "./Views/Contacto";
import ContactoAdmin from "./Views/ContactoAdmin";
import Contenido from "./Views/Contenido";
import DefaultLayout from "./Views/DefaultLayout";
import ExcelUploader from "./Views/ExcelUploader";
import Home from "./Views/Home";
import Novedades from "./Views/Novedades";
import PrivadaLayout from "./Views/PrivadaLayout";
import Productos from "./Views/Productos";
import ProductosAdmin from "./Views/ProductosAdmin";
import ProductosHijo from "./Views/ProductosHijo";
import ProductosLayout from "./Views/ProductosLayout";
import {
    default as SomosBronzen,
    default as SomosBronzenAdmin,
} from "./Views/SomosBronzenAdmin";
import SubCategorias from "./Views/SubCategorias";
import SubCategoriasAdmin from "./Views/SubCategoriasAdmin";
import SubirProductos from "./Views/SubirProductos";
import SubProductosAdmin from "./Views/SubProductosAdmin";

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
            {
                path: "/dashboard/sub-productos",
                element: <SubProductosAdmin />,
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
            {
                path: "/productos",
                element: <Productos />,
            },
            {
                path: "/productos/:id",
                element: <ProductosLayout />,
                children: [
                    {
                        path: "/productos/:id",
                        element: <SubCategorias />,
                    },
                    {
                        path: "/productos/:id/:id",
                        element: <ProductosHijo />,
                    },
                ],
            },
        ],
    },
    {
        path: "/privado",
        element: <PrivadaLayout />,
    },
]);

export default router;
