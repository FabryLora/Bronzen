import { faPenToSquare, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosClient from "../axios";

export default function MetadatosRow({ metadatosObject }) {
    const [seccion, setSeccion] = useState();
    const [keywords, setKeywords] = useState();
    const [descripcion, setDescripcion] = useState();

    function truncarTexto(texto, maxLength) {
        return texto?.length > maxLength
            ? texto?.slice(0, maxLength) + "..."
            : texto;
    }

    useEffect(() => {
        setSeccion(metadatosObject.seccion);
        setKeywords(metadatosObject.keywords);
        setDescripcion(metadatosObject.descripcion);
    }, [metadatosObject]);

    const [edit, setEdit] = useState(false);

    const update = async (e) => {
        e.preventDefault();

        try {
            await axiosClient.post(
                `/metadatos/${metadatosObject.id}?_method=PUT`,
                {
                    seccion,
                    keywords,
                    descripcion,
                }
            );
            toast.success("Metadatos actualizados correctamente");
            setEdit(false);
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar los metadatos");
        }
    };

    return (
        <div className="table-row h-[50px] bg-gray-200 max-h-[100px]">
            <div className="table-cell align-middle pl-2">{seccion}</div>

            <div className="table-cell align-middle max-w-[200px] max-h-[100px] break-words pr-2">
                {truncarTexto(keywords, 90)}
            </div>

            <div className="table-cell align-middle max-w-[200px] break-words">
                {truncarTexto(descripcion, 90)}
            </div>

            <div className="table-cell text-center align-middle">
                <button onClick={() => setEdit(true)}>
                    <FontAwesomeIcon icon={faPenToSquare} size="xl" />
                </button>
            </div>
            <AnimatePresence>
                {edit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="fixed top-0 left-0 bg-black/50  w-screen h-screen flex items-center justify-center z-50">
                            <form onSubmit={update} className="">
                                <div className="relative flex flex-col gap-4 bg-white p-4 w-[500px] ">
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1"
                                        onClick={() => setEdit(false)}
                                    >
                                        <FontAwesomeIcon icon={faX} size="sm" />
                                    </button>
                                    <h2>{seccion}</h2>
                                    <label htmlFor="keywords">Keywords</label>
                                    <textarea
                                        className="border py-1 pl-2"
                                        rows={6}
                                        value={keywords}
                                        onChange={(e) =>
                                            setKeywords(e.target.value)
                                        }
                                        id="keywords"
                                    />
                                    <label htmlFor="descripcion">
                                        Descripcion
                                    </label>
                                    <textarea
                                        className="border py-1 pl-2"
                                        rows={6}
                                        value={descripcion}
                                        onChange={(e) =>
                                            setDescripcion(e.target.value)
                                        }
                                        id="descripcion"
                                    />
                                    <button
                                        className="bg-blue-500 text-white py-1"
                                        type="submit"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
