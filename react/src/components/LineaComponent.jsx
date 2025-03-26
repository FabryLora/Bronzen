import { motion } from "motion/react";
import { Link } from "react-router-dom";
import testImage from "../assets/logos/bronzen-logo.png";

export default function LineaComponent() {
    return (
        <motion.div
            className="w-fit h-fit rounded-2xl bg-white shadow-md"
            initial={{ border: 0 }}
            whileHover={{ x: -8, y: -8, border: "4px solid white" }}
            transition={{ ease: "linear", duration: 0.2 }}
        >
            <Link
                style={{ backgroundImage: `url(${testImage})` }}
                className="w-[501px] h-[181px] rounded-2xl flex bg-white/90 items-end justify-start p-6 hover:outline hover:outline-black bg-no-repeat bg-contain bg-center"
            >
                <div className="felx flex-col">
                    <p className="text-[#5b6771] font-bold text-2xl">LINEA</p>
                    <h2 className="font-bold text-4xl">ALUMINIO</h2>
                </div>
            </Link>
        </motion.div>
    );
}
