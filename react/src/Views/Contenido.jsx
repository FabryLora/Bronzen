import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import adminAxiosClient from "../adminAxiosClient";
import { useStateContext } from "../context/ContextProvider";

export default function Contenido() {
    const { logos, fetchLogos, bannerInicio, fetchBannerInicio } =
        useStateContext();

    useEffect(() => {
        fetchLogos();
        fetchBannerInicio();
    }, []);

    const [principal, setPrincipal] = useState();
    const [secundario, setSecundario] = useState();
    const [bannerTitle, setBannerTitle] = useState(bannerInicio?.titulo);
    const [bannerSubtitle, setBannerSubtitle] = useState(
        bannerInicio?.subtitulo
    );
    const [bannerImage, setBannerImage] = useState();
    const [bannerVideo, setBannerVideo] = useState(bannerInicio?.video);

    useEffect(() => {
        setBannerTitle(bannerInicio?.titulo);
        setBannerSubtitle(bannerInicio?.subtitulo);
        setBannerVideo(bannerInicio?.video);
    }, [bannerInicio]);

    const updateAll = async (e) => {
        e.preventDefault();

        try {
            if (principal || secundario) {
                const formDataLogos = new FormData();
                if (principal) formDataLogos.append("principal", principal);
                if (secundario) formDataLogos.append("secundario", secundario);
                await adminAxiosClient.post(
                    `/logos/1?_method=PUT`,
                    formDataLogos,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                fetchLogos();
            }
            if (
                bannerInicio?.titulo !== bannerTitle ||
                bannerInicio?.subtitulo !== bannerSubtitle ||
                bannerInicio?.video !== bannerVideo ||
                bannerImage
            ) {
                const formDataBanner = new FormData();
                if (bannerImage) formDataBanner.append("imagen", bannerImage);
                formDataBanner.append("titulo", bannerTitle);
                formDataBanner.append("subtitulo", bannerSubtitle);
                formDataBanner.append("video", bannerVideo);
                await adminAxiosClient.post(
                    `/banner-inicio/1?_method=PUT`,
                    formDataBanner,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                fetchBannerInicio();
            }

            toast.success("Guardado correctamente");
        } catch (err) {
            toast.error("Error al guardar");
        }
    };

    return (
        <div className="">
            <Toaster />
            <form
                onSubmit={updateAll}
                className="p-5 flex flex-col justify-between h-fit"
            >
                <div className="w-full">
                    <div className=" border-gray-900/10 pb-12 flex flex-col gap-10">
                        <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                            Logos
                        </h2>
                        <div className="flex flex-row justify-between gap-5">
                            <div className="w-full">
                                <label
                                    htmlFor="logoprincipal"
                                    className="block font-medium text-gray-900 text-xl"
                                >
                                    Logo Principal <br />
                                    <span className="text-base font-normal">
                                        Resolucion recomendada: 206x37px
                                    </span>
                                </label>
                                <div className="mt-2 flex justify-between rounded-lg border shadow-lg">
                                    <div className=" w-1/2 h-[200px] bg-[rgba(0,0,0,0.2)]">
                                        <img
                                            className="w-full h-full object-cover rounded-md"
                                            src={logos?.principal_url}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex items-center justify-center w-1/2">
                                        <div className="text-center items-center h-fit self-center">
                                            <div className="relative items-center mt-4 flex flex-col text-sm/6 text-gray-600">
                                                <label
                                                    htmlFor="logoprincipal"
                                                    className="relative cursor-pointer rounded-md  font-semibold bg-primary-red  text-black py-1 px-2"
                                                >
                                                    <span>Cambiar Imagen</span>
                                                    <input
                                                        id="logoprincipal"
                                                        name="logoprincipal"
                                                        onChange={(e) =>
                                                            setPrincipal(
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                        type="file"
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="absolute top-10 break-words max-w-[200px]">
                                                    {" "}
                                                    {principal?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <label
                                    htmlFor="secundario"
                                    className="block font-medium text-gray-900 text-xl"
                                >
                                    Logo Secundario <br />
                                    <span className="text-base font-normal">
                                        Resolucion recomendada: 206x37px
                                    </span>
                                </label>
                                <div className="mt-2 flex justify-between rounded-lg border shadow-lg ">
                                    <div className="h-[200px] w-1/2 bg-[rgba(0,0,0,0.2)]">
                                        <img
                                            className="w-full h-full object-cover rounded-md"
                                            src={logos?.secundario_url}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex items-center justify-center w-1/2">
                                        <div className="text-center items-center h-fit self-center">
                                            <div className="relative mt-4 flex flex-col items-center text-sm/6 text-gray-600">
                                                <label
                                                    htmlFor="secundario"
                                                    className="relative cursor-pointer rounded-md  font-semibold bg-primary-red  text-black py-1 px-2"
                                                >
                                                    <span>Cambiar Imagen</span>

                                                    <input
                                                        id="secundario"
                                                        name="secundario"
                                                        onChange={(e) =>
                                                            setSecundario(
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                        type="file"
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="absolute top-10 break-words max-w-[200px]">
                                                    {" "}
                                                    {secundario?.name}{" "}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-3xl border-b-2 pb-2 text-primary-orange">
                            Banner
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <label
                                    className="font-semibold"
                                    htmlFor="bannerTitle"
                                >
                                    Titulo:
                                </label>
                                <input
                                    onChange={(e) =>
                                        setBannerTitle(e.target.value)
                                    }
                                    value={bannerTitle}
                                    type="text"
                                    className="border rounded-md pl-2 py-1"
                                    name="bannerTitle"
                                    id="bannerTitle"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    className="font-semibold"
                                    htmlFor="bannerSubtitle"
                                >
                                    Sub-titulo:
                                </label>
                                <input
                                    onChange={(e) =>
                                        setBannerSubtitle(e.target.value)
                                    }
                                    value={bannerSubtitle}
                                    type="text"
                                    className="border rounded-md pl-2 py-1"
                                    name="bannerSubtitle"
                                    id="bannerSubtitle"
                                />
                            </div>
                            <div className="flex flex-col col-span-2">
                                <label
                                    htmlFor="bannerVideo"
                                    className="font-semibold"
                                >
                                    Video:
                                </label>
                                <input
                                    onChange={(e) =>
                                        setBannerVideo(e.target.value)
                                    }
                                    value={bannerVideo}
                                    type="text"
                                    className="border rounded-md pl-2 py-1"
                                    name="bannerVideo"
                                    id="bannerVideo"
                                />
                            </div>
                            <div className="w-full col-span-2">
                                <label
                                    htmlFor="logoprincipal"
                                    className="block font-semibold text-gray-900"
                                >
                                    Imagen:
                                    <br />
                                    <span className="text-base font-normal">
                                        Resolucion recomendada: 1654x216 px
                                    </span>
                                </label>
                                <div className="mt-2 flex justify-between rounded-lg border shadow-lg  ">
                                    <div className=" w-2/3 h-[200px] bg-[rgba(0,0,0,0.2)]">
                                        <img
                                            className="w-full h-full object-cover rounded-md"
                                            src={bannerInicio?.imagen}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex items-center justify-center w-1/3">
                                        <div className="text-center items-center h-fit self-center">
                                            <div className="relative items-center mt-4 flex flex-col text-sm/6 text-gray-600">
                                                <label
                                                    htmlFor="bannerImage"
                                                    className="relative cursor-pointer rounded-md  font-semibold bg-primary-red  text-black py-1 px-2"
                                                >
                                                    <span>Cambiar Imagen</span>
                                                    <input
                                                        id="bannerImage"
                                                        name="bannerImage"
                                                        onChange={(e) =>
                                                            setBannerImage(
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                        type="file"
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="absolute top-10 break-words max-w-[200px]">
                                                    {" "}
                                                    {bannerImage?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <button className="hover:bg-primary-orange hover:text-white text-primary-orange border border-primary-orange transition font-bold rounded-full py-2 px-4">
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    );
}
