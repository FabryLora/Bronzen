import React, { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import defaultBg from "../assets/inicio/bg-somos-bronzen.jpg";
import axiosClient from "../axios";
import NovedadCard from "../components/NovedadCard";

export default function Novedades() {
    const [featuredProductos, setFeaturedProductos] = useState([]);
    const [loading, setLoading] = useState();

    const date = new Date();
    const month = date.toLocaleString("es-AR", { month: "long" });
    const year = date.getFullYear();

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        axiosClient
            .get("featured-products")
            .then(({ data }) => {
                setFeaturedProductos(data.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div
            style={{ backgroundImage: `url(${defaultBg})` }}
            className="min-h-screen h-fit w-full overflow-x-hidden py-10 md:py-20 bg-top bg-center bg-no-repeat bg-cover"
        >
            <div className="w-full max-w-[1200px] px-4 sm:px-6 mx-auto flex flex-col gap-3 md:gap-5">
                <div className="flex flex-col sm:flex-row text-white">
                    <h2 className="text-3xl md:text-[45px] font-bold">
                        NOVEDADES{" "}
                        <span className="text-xl md:text-[27px] italic uppercase font-medium">
                            {month.charAt(0).toUpperCase() + month.slice(1)}{" "}
                            {year}
                        </span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 md:gap-y-10 gap-x-4 justify-items-center">
                    {loading ? (
                        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 w-full mx-auto h-screen flex justify-center items-center">
                            <PulseLoader color="#ff6600" />
                        </div>
                    ) : (
                        featuredProductos?.map((prod, index) => (
                            <NovedadCard key={index} prod={prod} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
