import { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jambotron"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"
import ProductCard from "../components/cards/ProductCard"

const CategoryView = () => {

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({});

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if (params?.slug) loadProductsByCategory()
    }, [params?.slug])

    const loadProductsByCategory = async () => {
        try {
            const { data } = await axios.get(`/products-by-category/${params?.slug}`);
            setProducts(data.products);
            setCategory(data.category)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Jumbotron
                title={category?.name?.toUpperCase()}
                subTitle={`${products.length} products found in "${category?.name}"`}
            />
            <div className="container-fluid">
                <div className="row mt-3">
                    {products?.map(p => (
                        <div className="col-md-4" key={p._id}>
                            <ProductCard p={p} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default CategoryView;