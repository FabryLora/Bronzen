import { Toaster } from "react-hot-toast";
import MetadatosRow from "../components/MetadatosRow";
import { useStateContext } from "../context/ContextProvider";

export default function Metadatos() {
    const { metadatos } = useStateContext();

    return (
        <div className="table  w-[90%] mx-auto my-20">
            <Toaster />
            <div className="table-header-group ...">
                <div className="table-row bg-gray-300 h-[50px]">
                    <div className="table-cell text-left align-middle  pl-2">
                        Seccion
                    </div>
                    <div className="table-cell text-left align-middle ...">
                        Keyword
                    </div>
                    <div className="table-cell text-left align-middle ...">
                        Descripcion
                    </div>
                    <div className="table-cell text-center align-middle ...">
                        Operaciones
                    </div>
                </div>
            </div>
            <div className="table-row-group ">
                {metadatos.map((metadato, index) => (
                    <MetadatosRow key={index} metadatosObject={metadato} />
                ))}
            </div>
        </div>
    );
}
