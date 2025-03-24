import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "./Views/AdminLogin";
import Administrator from "./Views/Administrator";
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
        /* children: [
            {
                path: "/dashboard/slider",
                element: <SliderAdmin />,
            },
            {
                path: "/dashboard/logos",
                element: <LogosAdmin />,
            },
            {
                path: "/dashboard/nosotros-inicio",
                element: <NosotrosInicioAdmin />,
            },
            {
                path: "/dashboard/novedades",
                element: <NovedadesAdmin />,
            },

            {
                path: "/dashboard/nosotros",
                element: <NosotrosAdmin />,
            },
            {
                path: "/dashboard/contacto",
                element: <ContactoAdmin />,
            },
            {
                path: "/dashboard/subir-productos",
                element: <SubirProductos />,
            },
            {
                path: "/dashboard/subir-usuarios",
                element: <SubirUsuarios />,
            },
            {
                path: "/dashboard/categorias",
                element: <CategoriasAdmin />,
            },
            {
                path: "/dashboard/productos",
                element: <GruposDeProductos />,
            },

            {
                path: "/dashboard/clientes",
                element: <ClientesAdmin />,
            },
            {
                path: "/dashboard/administradores",
                element: <Administradores />,
            },
            {
                path: "/dashboard/lista-de-precios",
                element: <ListaDePreciosAdmin />,
            },
            {
                path: "/dashboard/pedidos-privada",
                element: <PedidosAdmin />,
            },
            {
                path: "/dashboard/sub-productos",
                element: <RealProducts />,
            },
            {
                path: "/dashboard/metadatos",
                element: <Metadatos />,
            },
            {
                path: "/dashboard/marcas",
                element: <MarcasAdmin />,
            },
            {
                path: "/dashboard/informacion",
                element: <InformacionCarrito />,
            },
            {
                path: "/dashboard/contenido",
                element: <Contenido />,
            },
        ], */
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
