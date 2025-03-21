import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../axios";
import { useStateContext } from "../context/ContextProvider";

export default function Dashboard() {
    const { adminLogout, adminToken, setAdmin } = useStateContext();

    useEffect(() => {
        axiosClient
            .get("/admin/me")
            .then(({ data }) => {
                setAdmin(data.admin);
            })
            .catch((error) => {
                console.error("Error loading admin:", error);
            });
    }, []);

    if (!adminToken) {
        return <Navigate to={"/adm"} />;
    }

    return (
        <div>
            <button onClick={adminLogout}>logout</button>
        </div>
    );
}
