import { faArrowUp, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import CliengoChat from "../Components/CliengoChat";
import Footer from "../Components/Footer";
import wpIcon from "../assets/icons/wp-icon.png";
import axiosClient from "../axios";
import NavBar from "../components/NavBar";
import { useStateContext } from "../context/ContextProvider";

export default function DefaultLayout() {
    const { contactInfo, userToken } = useStateContext();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleScroll = () => {
                if (window.scrollY > 0) {
                    setScrolled(true);
                } else {
                    setScrolled(false);
                }
            };

            window.addEventListener("scroll", handleScroll);

            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    const [cliengoConfig, setCliengoConfig] = useState({
        scriptUrl:
            "https://s.cliengo.com/weboptimizer/620babf8fce1e6002a464f63/620babfafce1e6002a464f68.js?platform=view_installation_code",
    });

    useEffect(() => {
        // Fetch Cliengo configuration from Laravel backend
        const fetchCliengoConfig = async () => {
            try {
                const response = await axiosClient.get("/cliengo-config");
                setCliengoConfig(response.data);
            } catch (error) {
                console.error("Failed to fetch Cliengo configuration", error);
            }
        };

        fetchCliengoConfig();
    }, []);

    const soloDejarNumeros = (number) => {
        if (number) {
            const cleanedNumber = number.replace(/\D/g, "");
            return `https://wa.me/${cleanedNumber}`;
        }
        return "";
    };

    if (userToken) {
        return <Navigate to={"/privado"} />;
    }

    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
            <CliengoChat scriptUrl={cliengoConfig.scriptUrl} />
            <AnimatePresence>
                {scrolled && (
                    <motion.button
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="fixed w-[50px] h-[50px] right-5 bottom-28 bg-white p-2 rounded-sm shadow-md z-50 "
                    >
                        <FontAwesomeIcon
                            icon={faArrowUp}
                            size="xl"
                            color="#ff9e19"
                        />
                    </motion.button>
                )}
            </AnimatePresence>
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-0 left-0"
                href={soloDejarNumeros(contactInfo?.wp)}
            >
                <img src={wpIcon} alt="" />
            </a>
        </>
    );
}
