export default function Footer() {
    return (
        <footer className="bg-[#d7d8da] text-[#62707b] h-[544px]">
            <div className="w-[1200px] mx-auto">
                <div className="flex flex-col py-5 items-center">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl">Estemos en contacto.</h2>
                        <p className="text-sm text-center">
                            Suscribite a nuestro newsletter:
                        </p>
                        <div className="flex flex-row gap-2">
                            <input
                                type="text"
                                className="text-center bg-white rounded-md placeholder:text-gray-400 placeholder:text-sm"
                                placeholder="Nombre y apellido"
                            />
                            <input
                                type="text"
                                className="text-center bg-white rounded-md placeholder:text-gray-400 placeholder:text-sm"
                                placeholder="Tu e-mail"
                            />
                            <input
                                type="text"
                                className="text-center bg-white rounded-md placeholder:text-gray-400 placeholder:text-sm"
                                placeholder="Empresa"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
