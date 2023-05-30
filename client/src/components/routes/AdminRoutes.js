import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Loading from "./Loading";
import axios from "axios";


const AdminRoutes = () => {

    const [auth] = useAuth();

    const [ok, setOk] = useState("");

    const AdminCheck = async () => {
        try {
            const { data } = await axios.get('/admin-check');
            if (data.ok) {
                setOk(true);
            } else {
                setOk(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (auth?.token) AdminCheck();
    }, [auth?.token])

    return ok ? <Outlet /> : <Loading path="/" />
}

export default AdminRoutes;