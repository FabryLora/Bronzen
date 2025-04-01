// LineaComponent.jsx
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function LineaComponent({ categoriaObject }) {
    return (
        <div className="relative w-[501px] h-[181px]">
            <motion.div
                className="absolute w-full h-full rounded-3xl  shadow-lg"
                initial={{
                    border: 0,
                    boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.0)",
                }}
                whileHover={{
                    x: -8,
                    y: -8,
                    border: "4px solid white",
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)",
                }}
                transition={{ ease: "linear", duration: 0.2 }}
            >
                <Link
                    to={`/productos/${categoriaObject?.id}`}
                    style={{
                        backgroundImage: `url(${categoriaObject?.image})`,
                    }}
                    className="w-full h-full rounded-3xl flex  items-end justify-start p-6 hover:outline hover:outline-black bg-no-repeat bg-cover bg-center"
                >
                    <div className="flex flex-col">
                        <p className="text-[#5b6771] font-bold text-2xl">
                            {categoriaObject?.name && "LINEA"}
                        </p>
                        <h2 className="font-bold text-4xl">
                            {categoriaObject?.name}
                        </h2>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
