import { createBrowserRouter } from "react-router-dom";
import Administradores from "./Views/Administradores";
import Administrator from "./Views/Administrator";
import AdminLogin from "./Views/AdminLogin";
import BusquedaLayout from "./Views/BusquedaLayout";
import CatalogoAdmin from "./Views/CatalogoAdmin";
import CategoriasAdmin from "./Views/CategoriasAdmin";
import ClientesAdmin from "./Views/ClientesAdmin";
import Contacto from "./Views/Contacto";
import ContactoAdmin from "./Views/ContactoAdmin";
import Contenido from "./Views/Contenido";
import DefaultLayout from "./Views/DefaultLayout";
import ExcelUploader from "./Views/ExcelUploader";
import Home from "./Views/Home";
import Informacion from "./Views/Informacion";
import Metadatos from "./Views/Metadatos";
import MisFacturas from "./Views/MisFacturas";
import Mispedidos from "./Views/MisPedidos";
import Novedades from "./Views/Novedades";
import Pedidos from "./Views/Pedidos";
import PedidosAdmin from "./Views/PedidosAdmin";
import PrivadaLayout from "./Views/PrivadaLayout";
import ProductoOnly from "./Views/ProductoOnly";
import ProductoOnlyPrivada from "./Views/ProductoOnlyPrivada";
import Productos from "./Views/Productos";
import ProductosAdmin from "./Views/ProductosAdmin";
import ProductosHijo from "./Views/ProductosHijo";
import ProductosLayout from "./Views/ProductosLayout";
import ProductosPrivado from "./Views/ProductosPrivado";
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
            {
                path: "/dashboard/clientes",
                element: <ClientesAdmin />,
            },
            {
                path: "/dashboard/informacion",
                element: <Informacion />,
            },
            {
                path: "/dashboard/mis-pedidos",
                element: <PedidosAdmin />,
            },
            {
                path: "/dashboard/administradores",
                element: <Administradores />,
            },
            {
                path: "/dashboard/metadatos",
                element: <Metadatos />,
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
                path: "/busqueda/:id",
                element: <BusquedaLayout />,
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
                    {
                        path: "/productos/:id/:id/:id",
                        element: <ProductoOnly />,
                    },
                ],
            },
        ],
    },
    {
        path: "/privado",
        element: <PrivadaLayout />,
        children: [
            {
                path: "/privado/productos",
                element: <ProductosPrivado />,
            },
            {
                path: "/privado/pedidos",
                element: <Pedidos />,
            },
            {
                path: "/privado/mis-pedidos",
                element: <Mispedidos />,
            },
            {
                path: "/privado/facturas",
                element: <MisFacturas />,
            },
            {
                path: "/privado/productos/:id",
                element: <ProductoOnlyPrivada />,
            },
        ],
    },
]);

export default router;
