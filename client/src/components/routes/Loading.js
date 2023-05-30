import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingGif from "../../images/loading.gif"

const Loading = ({ path = "login" }) => {

    const [count, setCount] = useState(1);

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => --prev);
        }, 1000);

        count === 0 && navigate(`/${path}`, {
            state: location.pathname
        });

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [count])

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
            <img src={LoadingGif} style={{ width: "400px" }} alt={'loading'} />
        </div>
    );
}

export default Loading;