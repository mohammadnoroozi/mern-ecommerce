import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Badge } from "antd";
import { FaDollarSign, FaProjectDiagram, FaRegClock, FaCheck, FaTimes, FaWarehouse, FaRocket } from "react-icons/fa";
import moment from "moment";
import ProductCard from "../components/cards/ProductCard";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

const ProductView = () => {

    const [, setCart] = useCart();

    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);

    const { slug } = useParams();

    useEffect(() => {
        if (slug) {
            loadProduct();
        }
        // eslint-disable-next-line
    }, [slug]);

    const loadProduct = async () => {
        try {
            const { data } = await axios.get(`/product/${slug}`);
            setProduct(data)
            loadRelated(data?._id, data?.category?._id);
        } catch (err) {
            console.log(err);
        }
    }


    const loadRelated = async (productId, categoryId) => {
        try {
            const { data } = await axios.get(`/related-products/${productId}/${categoryId}`);
            setRelated(data);
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-9">
                    <div className='card mb-3'>
                        <Badge.Ribbon text={`${product?.sold} sold`} color="red">
                            <Badge.Ribbon
                                text={`${product?.quantity >= 1 ? `${product?.quantity - product?.sold} in stock` : "Out of stock"}`}
                                placement="start"
                                color={"green"}
                            >
                                {product?._id && (
                                    <img
                                        className='card-img-top'
                                        src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                                        alt={product.name}
                                        style={{ height: "500px", width: "100%", objectFit: "contain" }}
                                    />
                                )}
                            </Badge.Ribbon>
                        </Badge.Ribbon>
                        <div className='card-body'>
                            <h1 className="fw-bold">{product?.name}</h1>
                            <p className='card-text lead'>{product?.description}</p>
                        </div>

                        <div className="d-flex justify-content-between lead p-5 bg-light align-items-center fw-bold">
                            <div>
                                <p className="d-flex align-items-center">
                                    <FaDollarSign className="me-2" /> Price: {product?.price?.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </p>

                                <p className="d-flex align-items-center">
                                    <FaProjectDiagram className="me-2" /> Category: {product?.category?.name}
                                </p>

                                <p className="d-flex align-items-center">
                                    <FaRegClock className="me-2" /> Added: {moment(product?.createdAt).fromNow()}
                                </p>

                                <p className="d-flex align-items-center">
                                    {product?.quantity > 0 ? <FaCheck className="me-2" /> : <FaTimes className="me-2" />}{" "}
                                    {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                                </p>

                                <p className="d-flex align-items-center">
                                    <FaWarehouse className="me-2" /> Available: {product?.quantity - product?.sold}
                                </p>

                                <p className="d-flex align-items-center">
                                    <FaRocket className="me-2" /> Sold: {product?.sold}
                                </p>

                            </div>
                        </div>

                        <button className='btn btn-outline-primary col card-button' style={{ borderBottomRightRadius: "5px" }}
                            onClick={() => {
                                setCart((prev) => ([...prev, product]));
                                toast.success(`"${product?.name}" Added to cart`)
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                <div className="col-md-3">
                    <h2>Related Products</h2>
                    <hr />
                    {related.length > 1 ? (
                        related?.map(p => (
                            <ProductCard p={p} key={p._id} />
                        ))
                    ) : (
                        "Nothing found"
                    )}
                </div>

            </div>
        </div>
    );
}

export default ProductView;