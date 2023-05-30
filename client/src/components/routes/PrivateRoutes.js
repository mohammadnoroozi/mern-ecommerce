import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Loading from "./Loading";
import axios from "axios";


const PrivateRoutes = () => {

    const [auth] = useAuth();

    const [ok, setOk] = useState("");

    const authCheck = async () => {
        try {
            const { data } = await axios.get('/auth-check');
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
        if (auth?.token) authCheck();
    }, [auth?.token])

    return ok ? <Outlet /> : <Loading />
}

export default PrivateRoutes;