import React, { useEffect, useState } from "react";

const SubscriberForm = ({ subscriber, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        active: true,
    });

    useEffect(() => {
        if (subscriber) {
            setFormData({
                email: subscriber.email || "",
                name: subscriber.name || "",
                active: subscriber.active,
            });
        }
    }, [subscriber]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                {subscriber ? "Editar Suscriptor" : "Añadir Suscriptor"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 border rounded shadow-sm"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                {subscriber && (
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-gray-700">Activo</span>
                        </label>
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {subscriber ? "Actualizar" : "Añadir"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubscriberForm;
