import moment from "moment";
import { useCart } from "../../context/cart";

const ProductCardHorizontal = ({ p, remove = true }) => {

    const [cart, setCart] = useCart();

    const removeFromCart = (p) => {
        setCart((prev) => {
            localStorage.setItem("cart", JSON.stringify(prev.filter(c => c._id !== p._id)));
            return prev.filter(c => c._id !== p._id)
        })
    }

    return (
        <div className="card mb-3 p-0" style={{ width: "90%" }}>
            <div className="row g-0">
                <div className="col-md-3">
                    <img src={`${process.env.REACT_APP_API}/product/photo/${p._id}`} alt={p.name} className={"img img-fluid img-responsive rounded-start"}
                        style={{ width: "150px", height: "200px", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-9">
                    <div className="card-body">
                        <h5 className="card-title">
                            {p.name}
                        </h5>
                        <p className="card-text">
                            {p?.description?.substring(0, 80)}...
                        </p>
                        <p className="card-text">
                            <small className="text-muted">
                                Listed {moment(p.createdAt).fromNow()}
                            </small>
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                            <h5 className="card-title">
                                {p?.price?.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD"
                                })}
                            </h5>
                            {remove ? (
                                <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(p)}>
                                    Remove
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProductCardHorizontal;