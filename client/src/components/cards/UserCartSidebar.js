import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import DropIn from "braintree-web-drop-in-react";
import toast from "react-hot-toast";

const UserCartSidebar = () => {

    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();

    const [loading, setLoading] = useState(false);

    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.token) {
            getClientToken();
        }
    }, [auth?.token])


    const getClientToken = async () => {
        try {
            const { data } = await axios.get("/braintree/token");
            console.log(data);
            setClientToken(data.clientToken)
        } catch (err) {
            console.log(err);
            toast.error("Payment Failed. Please refresh page and try again")
        }
    }

    const cartTotal = () => {
        let total = 0;
        cart?.map(item => {
            total += item?.price
        })
        return total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        })
    }

    const handleBuy = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post("/braintree/payment", {
                nonce,
                cart
            })
            setLoading(false);
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment successful")
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast.error("Payment Failed. Please refresh page and try again");
        }
    }

    return (
        <div className="col-md-4 mb-5">
            <h4>
                Your cart summary
            </h4>
            Total / Address / Payments
            <hr />
            <h6>
                Total: {cartTotal()}
            </h6>
            {auth?.user?.address ? (
                <>
                    <div className="mb-3">
                        <hr />
                        <h4>
                            Address:
                        </h4>
                        <h5>
                            {auth?.user?.address}
                        </h5>
                    </div>
                    <button className="btn btn-outline-warning w-100" onClick={() => navigate("/dashboard/user/profile")}>
                        Update address
                    </button>
                </>
            ) : (
                <div className="mb-3 mt-3">
                    {auth?.token ? (
                        <button
                            className="btn btn-outline-warning w-100"
                            onClick={() => navigate("/dashboard/user/profile")}
                        >
                            Add delivery address
                        </button>
                    ) : (
                        <button className="btn btn-outline-primary w-100" onClick={() => navigate("/login", {
                            state: "/cart"
                        })}>
                            Login to checkout
                        </button>
                    )}
                </div>
            )}

            <div>
                {clientToken && (
                    <>
                        <DropIn
                            options={{
                                authorization: clientToken,
                            }}
                            onInstance={instance => setInstance(instance)}
                        />
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleBuy}
                            disabled={!auth?.user?.address || !instance || loading}
                        >
                            {loading ? "Processing..." : "Buy"}
                        </button>
                    </>
                )}
            </div>

        </div>
    );
}

export default UserCartSidebar;