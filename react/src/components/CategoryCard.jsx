import { Link } from "react-router-dom";
import testphoto from "../assets/logos/logo-principal.png";

export default function CategoryCard({ categoryObject }) {
    return (
        <Link
            to={`/productos/${categoryObject?.id}`}
            className="w-[288px] h-[288px] relative border flex justify-center items-center text-white max-sm:w-full max-sm:px-6 "
        >
            <div className="absolute w-full h-full [background:linear-gradient(180deg,rgba(0,0,0,0.13)_0%,rgba(0,0,0,0.67)_100%)]"></div>
            <img
                className="w-full h-full object-contain"
                src={categoryObject?.imagen_url || testphoto}
                alt=""
                onError={(e) => {
                    e.target.src = testphoto;
                }}
            />
            <h2 className="absolute bottom-5 font-bold">
                {categoryObject?.nombre}
            </h2>
        </Link>
    );
}
