import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Jumbotron from "../../components/cards/Jambotron";
import AdminMenu from "../../components/nav/AdminMenu";
import { useAuth } from "../../context/auth";
import moment from "moment";

const AdminProducts = () => {

    const [auth] = useAuth();

    const [products, setProducts] = useState([]);

    const loadProducts = async () => {
        try {
            const { data } = await axios.get("/products");
            setProducts(data)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <>
            <Jumbotron title={`Hello ${auth?.user?.name}`} subTitle="Admin Dashboard" />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="bg-light p-3 mt-2 mb-2 h4">
                            Products
                        </div>

                        {products?.map(p => (
                            <Link key={p._id} to={`/dashboard/admin/product/update/${p.slug}`}>
                                <div className="card mb-3">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <img
                                                src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
                                                alt={p.name}
                                                className="img img-fluid rounded-start product-image"
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <div className="card-body">
                                                <h5 className="card-title text-dark">
                                                    {p.name}
                                                </h5>
                                                <p className="card-text">
                                                    {p.description?.substring(0,400)}...
                                                </p>
                                                <p className="card-text">
                                                    <small className="text-muted">
                                                        {moment(p.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                                                    </small>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminProducts;