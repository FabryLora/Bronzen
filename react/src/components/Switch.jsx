import adminAxiosClient from "../adminAxiosClient";

const Switch = ({ id, path, enabled = false, onChange, className = "" }) => {
    const handleToggle = async () => {
        onChange(!enabled);
        try {
            await adminAxiosClient.put(`${path}/${id}`, {
                featured: !enabled ? 1 : 0,
            });
        } catch (error) {
            console.error("Error updating featured status", error);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`relative  w-12 h-6 flex items-center rounded-full px-1 py-2 transition-colors duration-300 ${
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
