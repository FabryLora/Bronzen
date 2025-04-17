import React from "react";

const SubscriberList = ({ subscribers, onEdit, onDelete }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Suscriptores ({subscribers.length})
            </h2>

            {subscribers.length === 0 ? (
                <p className="text-gray-500">
                    No hay suscriptores registrados.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b text-left">
                                    Email
                                </th>
                                <th className="px-4 py-2 border-b text-left">
                                    Nombre
                                </th>
                                <th className="px-4 py-2 border-b text-left">
                                    Estado
                                </th>
                                <th className="px-4 py-2 border-b text-left">
                                    Fecha de suscripción
                                </th>
                                <th className="px-4 py-2 border-b text-left">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((subscriber) => (
                                <tr key={subscriber.id}>
                                    <td className="px-4 py-2 border-b">
                                        {subscriber.email}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {subscriber.name || "-"}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${
                                                subscriber.active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {subscriber.active
                                                ? "Activo"
                                                : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {new Date(
                                            subscriber.subscribed_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => onEdit(subscriber)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                onDelete(subscriber.id)
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SubscriberList;
