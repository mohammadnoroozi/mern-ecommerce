import axios from "axios";
import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jambotron";
import ProductCard from "../components/cards/ProductCard";

export default function Home() {

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadProducts();
        getTotal()
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (page !== 1) loadMore()
        // eslint-disable-next-line
    }, [page]);

    const getTotal = async () => {
        try {
            const { data } = await axios.get("/products-count");
            setTotal(data);
        } catch (err) {
            console.log(err);
        }
    }

    const loadProducts = async () => {
        try {
            const { data } = await axios.get(`/list-products/${page}`);
            setProducts(data);
        } catch (err) {
            console.log(err);
        }
    }

    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/list-products/${page}`);
            setProducts(prev => ([...prev, ...data]));
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const arr = [...products];

    const sortedBySold = arr?.sort((a, b) => a.sold < b.sold ? 1 : -1)

    return (
        <div>
            <Jumbotron title={"Hello World"} subTitle={"Welcome to React E-commerce"} />

            <div className="row container-fluid px-5 justify-content-center">
                <div className="col-md-6">
                    <h2 className="p-3 mt-2 mb-2 bg-light h4 text-center position-sticky-top-100">
                        New Arrivals
                    </h2>
                    <div className="row">
                        {products?.map(p => (
                            <div className="col-md-6" key={p._id}>
                                <ProductCard p={p} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-6">
                    <h2 className="p-3 mt-2 mb-2 bg-light h4 text-center position-sticky-top-100">
                        Best Sellers
                    </h2>
                    <div className="row">
                        {sortedBySold?.map(p => (
                            <div className="col-md-6" key={p._id}>
                                <ProductCard p={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="container d-flex justify-content-center">
                {products && products.length < total && (
                    <button className="btn btn-outline-primary w-50 my-5"
                        disabled={loading}
                        onClick={() => {
                            setPage(page + 1)
                        }}
                    >
                        {loading ? "Loading..." : "Load more"}
                    </button>
                )}
            </div>


        </div>
    );
}