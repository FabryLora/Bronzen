import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Toaster, toast } from "react-hot-toast";
import axiosClient from "../axios";
import CustomReactQuill from "../components/CustomReactQuill";
import MassEmailTemplate from "../Components/MassEmailTemplate";
import NewsletterRow from "../Components/NewsletterRow";
import { useStateContext } from "../context/ContextProvider";

export default function NewsletterManager() {
    const { fetchSubscribers, subscribers } = useStateContext();
    const [createView, setCreateView] = useState(false);
    const [title, setTitle] = useState();
    const [text, setText] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const sendEmail = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("text", text);

        const htmlContent = ReactDOMServer.renderToString(
            <MassEmailTemplate
                info={{
                    title,
                    text,
                }}
            />
        );

        const response = axiosClient.post("/sendmassmail", {
            html: htmlContent,
        });

        toast.promise(response, {
            loading: "Enviando...",
            success: "Mensaje enviado correctamente",
            error: "Error al enviar el mensaje",
        });

        try {
            await response;
            console.log("Correo enviado:", response.data);
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }
    };

    // Filtrar categorías por búsqueda
    const filteredCategorias = subscribers?.sort((a, b) => {
        // Verificar si alguno de los valores es null o undefined
        const aOrdenIsNull = a?.orden === null || a?.orden === undefined;
        const bOrdenIsNull = b?.orden === null || b?.orden === undefined;

        // Si ambos son null/undefined, no importa el orden entre ellos
        if (aOrdenIsNull && bOrdenIsNull) return 0;

        // Si solo a es null/undefined, va después de b
        if (aOrdenIsNull) return 1;

        // Si solo b es null/undefined, va después de a
        if (bOrdenIsNull) return -1;

        // Si ambos son números, ordenar numéricamente
        if (!isNaN(Number(a.orden)) && !isNaN(Number(b.orden))) {
            return Number(a.orden) - Number(b.orden);
        }

        // Orden alfabético como fallback
        return String(a.orden).localeCompare(String(b.orden), undefined, {
            numeric: true,
        });
    });

    // Calcular los datos a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategorias?.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math?.ceil(filteredCategorias?.length / itemsPerPage);

    return (
        <div className="flex flex-col w-full p-6">
            <Toaster />
            <AnimatePresence>
                {createView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 text-left"
                    >
                        <form
                            onSubmit={sendEmail}
                            method="POST"
                            className="text-black"
                        >
                            <div className="bg-white p-4 w-[700px]  rounded-md">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Crear mail
                                </h2>
                                <div className="flex flex-col h-full gap-4">
                                    <label htmlFor="nombree">
                                        Titulo{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="outline outline-gray-300 p-2 rounded-md focus:outline focus:outline-primary-orange"
                                        type="text"
                                        name="nombree"
                                        id="nombree"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />

                                    <label htmlFor="ordennn">Texto</label>
                                    <CustomReactQuill
                                        additionalStyles="h-[300px]"
                                        onChange={setText}
                                        value={text}
                                    />

                                    <div className="flex justify-end gap-4 pt-10">
                                        <button
                                            type="button"
                                            onClick={() => setCreateView(false)}
                                            className="border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={sendEmail}
                                            type="submit"
                                            className="border border-primary-orange text-primary-orange py-1 px-2 hover:bg-primary-orange hover:text-white transition duration-300 rounded-md"
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex flex-col w-full  mx-auto gap-3">
                <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                    Newsletter
                </h2>
                <div className="w-full flex h-fit flex-row gap-5">
                    <input
                        type="text"
                        placeholder="Buscar mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 border border-gray-300 rounded-md w-full"
                    />
                    <button
                        onClick={() => setCreateView(true)}
                        className="bg-primary-orange hover:bg-orange-400 w-[200px] text-white font-bold py-1 px-4 rounded"
                    >
                        Crear mail
                    </button>
                </div>

                <div className="flex justify-center w-full">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border">
                        <thead className="text-sm font-medium text-black bg-gray-300 uppercase">
                            <tr>
                                <td className="text-center ">NOMBRE</td>

                                <td className="text-center ">EMAIL</td>
                                <td className="text-center ">EMPRESA</td>

                                <td className="w-[400px] py-2 px-3 text-center">
                                    ACTIVO
                                </td>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {filteredCategorias?.map((subscriber) => (
                                <NewsletterRow
                                    key={subscriber.id}
                                    newsObject={subscriber}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Paginación */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded-l-md disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 bg-gray-200">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded-r-md disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
