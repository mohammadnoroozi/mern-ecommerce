import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import Jumbotron from "../components/cards/Jambotron"
import { Link } from "react-router-dom";
import UserCartSidebar from "../components/cards/UserCartSidebar";
import ProductCardHorizontal from "../components/cards/ProductCardHorizontal";


const Cart = () => {

    const [auth] = useAuth();
    const [cart, setCart] = useCart();

    return (
        <>
            <Jumbotron
                title={`Hello ${auth?.token && auth?.user?.name}`}
                subTitle={cart?.length > 0 ? `You have ${cart?.length} items in the cart. ${auth?.token ? '' : 'Please login to checkout'}` : "Your cart is empty"}
            />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="p-3 mt-2 mb-2 h4 text-center bg-light">
                            {cart?.length > 0 ? (
                                "My Cart"
                            ) : (
                                <Link to={"/"}>
                                    <button className="btn btn-outline-primary w-50 btn-lg">
                                        Continue Shopping
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {cart?.length > 0 && (
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                {cart?.map((p, index) => (
                                    <ProductCardHorizontal p={p} key={index} />
                                ))}
                            </div>
                        </div>

                        <UserCartSidebar />

                    </div>
                </div>
            )}
        </>
    );
}

export default Cart;