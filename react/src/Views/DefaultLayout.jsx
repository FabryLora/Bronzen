import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import NavBar from "../components/NavBar";

export default function DefaultLayout() {
    /* if (userToken) {
        return <Navigate to={"/privado"} />;
    } */

    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
}
