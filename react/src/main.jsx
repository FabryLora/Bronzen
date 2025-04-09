import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import { ContextProvider } from "./context/ContextProvider.jsx";
import "./index.css";
import router from "./router";

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("Nueva versión disponible. ¿Actualizar ahora?")) {
            updateSW();
        }
    },
    onOfflineReady() {
        console.log("La aplicación está lista para usarse sin conexión.");
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ContextProvider>
            <RouterProvider router={router}></RouterProvider>
        </ContextProvider>
    </StrictMode>
);
