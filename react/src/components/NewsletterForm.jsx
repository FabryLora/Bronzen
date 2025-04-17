import React, { useState } from "react";

const NewsletterForm = ({ subscriberCount, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        subject: "",
        content: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            window.confirm(
                `¿Estás seguro de enviar este newsletter a ${subscriberCount} suscriptores?`
            )
        ) {
            onSubmit(formData);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Enviar Newsletter</h2>
            <p className="mb-4 text-gray-600">
                Este mensaje será enviado a {subscriberCount} suscriptores
                activos.
            </p>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 border rounded shadow-sm"
            >
                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-2"
                        htmlFor="subject"
                    >
                        Asunto *
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-2"
                        htmlFor="content"
                    >
                        Contenido *
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="10"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Puedes usar HTML para dar formato al contenido"
                        required
                    ></textarea>
                    <p className="mt-1 text-sm text-gray-500">
                        Puedes usar HTML para dar formato al contenido del
                        newsletter.
                    </p>
                </div>

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
                        Enviar newsletter
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewsletterForm;
