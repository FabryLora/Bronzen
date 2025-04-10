import { useEffect, useState } from "react";
import adminAxiosClient from "../adminAxiosClient";

const Switch = ({ id, path, initialEnabled, className = "" }) => {
    // Use local state to track the switch state
    const [enabled, setEnabled] = useState(initialEnabled);

    // Update local state if initialEnabled changes (when parent rerenders)
    useEffect(() => {
        setEnabled(initialEnabled);
    }, [initialEnabled]);

    const handleToggle = async () => {
        // Toggle local state first for immediate UI feedback
        const newState = !enabled;
        setEnabled(newState);

        try {
            if (path === "/clientes") {
                await adminAxiosClient.put(`${path}/${id}`, {
                    autorizado: newState ? 1 : 0,
                });
            } else if (path === "/sub-productos") {
                await adminAxiosClient.put(`${path}/${id}`, {
                    stock: newState ? 1 : 0,
                });
            } else if (path === "/categorias") {
                await adminAxiosClient.put(`${path}/${id}`, {
                    show_text: newState ? 1 : 0,
                });
            } else {
                await adminAxiosClient.put(`${path}/${id}`, {
                    featured: newState ? 1 : 0,
                });
            }
        } catch (error) {
            // Revert back if API call fails
            console.error("Error updating status", error);
            setEnabled(!newState);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`relative w-12 h-6 flex items-center rounded-full px-1 py-2 transition-colors duration-300 ${
                enabled ? "bg-blue-500" : "bg-gray-300"
            } ${className}`}
        >
            <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    enabled ? "translate-x-5" : "translate-x-0"
                }`}
            ></div>
        </button>
    );
};

export default Switch;
