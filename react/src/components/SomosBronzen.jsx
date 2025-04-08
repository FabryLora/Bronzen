import React from "react";
import background from "../assets/inicio/bg-somos-bronzen.jpg";
import { useStateContext } from "../context/ContextProvider";

export default function SomosBronzen() {
    const { somosBronzenInicio } = useStateContext();

    return (
        <div
            style={{ backgroundImage: `url(${background})` }}
            className="h-[680px] max-sm:h-auto max-sm:min-h-[600px] w-full bg-no-repeat bg-cover bg-top bg-center"
        >
            <div className="w-[1200px] max-sm:w-full max-sm:px-4 mx-auto h-full">
                <div className="flex flex-row max-sm:flex-col justify-between h-full py-20 max-sm:py-12">
                    <div className="flex flex-col w-full max-sm:w-full text-white gap-12 max-sm:gap-6 max-sm:order-2">
                        <h2 className="text-5xl max-sm:text-3xl font-bold">
                            {somosBronzenInicio?.title}
                        </h2>
                        <div
                            className="prose-h2:text-2xl max-sm:prose-h2:text-xl prose-p:text-[14px] prose-p:pt-1"
                            dangerouslySetInnerHTML={{
                                __html: somosBronzenInicio?.text,
                            }}
                        />
                    </div>
                    <div className="flex justify-center items-center w-full max-sm:w-full max-sm:py-8 max-sm:order-1">
                        <img
                            src={somosBronzenInicio?.image}
                            className="max-sm:w-full max-sm:max-w-[300px] max-sm:object-contain"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
