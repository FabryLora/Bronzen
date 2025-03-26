import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";

export default function BannerInicio() {
    const { bannerInicio } = useStateContext();
    const [videoOpen, setVideoOpen] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (videoRef.current && !videoRef.current.contains(event.target)) {
                setVideoOpen(false); // Cierra cuando se toca fuera
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {videoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed left-0 top-0 bg-black/50 w-screen h-screen z-50 flex justify-center items-center"
                    >
                        <button
                            onClick={() => setVideoOpen(false)}
                            className="absolute top-10 right-10"
                        >
                            <FontAwesomeIcon
                                icon={faX}
                                color="#fff"
                                size="xl"
                            />
                        </button>
                        <iframe
                            ref={videoRef}
                            className="w-full max-w-[1200px] aspect-video"
                            src={bannerInicio?.video?.replace(
                                "watch?v=",
                                "embed/"
                            )}
                            title="BRONZEN Showroom"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                        ></iframe>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative h-[216px] w-full flex justify-center items-center">
                <img
                    src={bannerInicio?.imagen}
                    className="absolute w-full h-full object-cover"
                    alt=""
                />
                <div className="absolute w-[1200px] mx-auto">
                    <div className="flex flex-col items-end py-8 text-white gap-5">
                        <h2 className="font-bold text-4xl">
                            {bannerInicio?.titulo}
                        </h2>
                        <p className="text-sm">{bannerInicio?.subtitulo}</p>
                        <button
                            onClick={() => setVideoOpen(true)}
                            className="h-[52px] w-[112px] text-sm text-white bg-primary-orange font-bold rounded-[50px] p-6 flex justify-center items-center shadow-md hover:bg-primary-orange/90 transition duration-300"
                        >
                            Ver video
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
