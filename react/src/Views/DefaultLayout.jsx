import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function DefaultLayout() {
    /* if (userToken) {
        return <Navigate to={"/privado"} />;
    } */

    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}
