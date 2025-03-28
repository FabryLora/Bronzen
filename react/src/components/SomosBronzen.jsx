import React from "react";
import background from "../assets/inicio/bg-somos-bronzen.jpg";
import { useStateContext } from "../context/ContextProvider";

export default function SomosBronzen() {
    const { somosBronzenInicio } = useStateContext();

    return (
        <div
            style={{ backgroundImage: `url(${background})` }}
            className="h-[680px] w-full bg-no-repeat bg-cover bg-top bg-center"
        >
            <div className="w-[1200px] mx-auto h-full">
                <div className="flex flex-row justify-between h-full py-20 ">
                    <div className="flex flex-col w-full text-white gap-12">
                        <h2 className="text-5xl font-bold">
                            {somosBronzenInicio?.title}
                        </h2>
                        <div
                            className="prose-h2:text-2xl prose-p:text-[14px] prose-p:pt-1"
                            dangerouslySetInnerHTML={{
                                __html: somosBronzenInicio?.text,
                            }}
                        />
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <img
                            src={somosBronzenInicio?.image}
                            className=""
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
