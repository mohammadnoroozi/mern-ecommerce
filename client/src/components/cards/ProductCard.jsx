import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";


const ProductCard = ({ p }) => {

    const navigate = useNavigate();

    const [ , setCart] = useCart();

    return (
        <div className='card mb-3 hoverable product-card'>

            <Badge.Ribbon text={`${p?.sold} sold`} color="red">
                <Badge.Ribbon
                    text={`${p?.quantity >= 1 ? `${p?.quantity - p?.sold} in stock` : "Out of stock"}`}
                    placement="start"
                    color={"green"}
                >
                    <img
                        className='card-img-top'
                        src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
                        alt={p.name}
                        style={{ height: "350px", objectFit: "cover" }}
                    />
                </Badge.Ribbon>
            </Badge.Ribbon>

            <div className='card-body'>
                <h5>{p?.name}</h5>

                <h4>{p?.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD"
                })}</h4>

                <p className='card-text'>{p?.description?.substring(0, 60)}...</p>
            </div>

            <div className='d-flex justify-content-between'>
                <button className='btn btn-primary col card-button' style={{ borderBottomLeftRadius: "5px" }}
                    onClick={() => navigate(`/product/${p.slug}`)}
                >
                    View Product
                </button>
                <button className='btn btn-outline-primary col card-button'
                    style={{ borderBottomRightRadius: "5px" }}
                    onClick={() => {
                        setCart((prev) => {
                            localStorage.setItem("cart", JSON.stringify([...prev, p]));
                            return [...prev, p]
                        });

                        toast.success(`"${p?.name}" Added to cart`)
                    }}
                >
                    Add to Cart
                </button>
            </div>

        </div>
    );
}

export default ProductCard;