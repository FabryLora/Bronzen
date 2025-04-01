import { useEffect } from "react";
import BannerInicio from "../Components/BannerInicio";
import Catalogo from "../Components/Catalogo";
import NovedadesInicio from "../Components/NovedadesInicio";
import NuestrosProductos from "../Components/NuestrosProductos";
import SomosBronzen from "../Components/SomosBronzen";

export default function Home() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <BannerInicio />
            <NovedadesInicio />
            <NuestrosProductos />
            <Catalogo />
            <SomosBronzen />
        </>
    );
}
