import axios from "axios";
import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jambotron";
import ProductCard from "../components/cards/ProductCard";
import { Checkbox, Radio } from "antd";
import { prices } from "../prices";

const Shop = () => {

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);

    useEffect(() => {
        if (checked.length || radio.length) loadFilteredProducts();
        // eslint-disable-next-line
    }, [checked, radio]);

    useEffect(() => {
        if (!checked.length && !radio.length) loadProducts();
    }, [checked, radio]);

    useEffect(() => {
        loadCategories();
    }, [])

    const loadFilteredProducts = async () => {
        try {
            const { data } = await axios.post("/filtered-products", { checked, radio });
            setProducts(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("/categories");
            setCategories(data);
        } catch (err) {
            console.log(err);
        }
    }

    const loadProducts = async () => {
        try {
            const { data } = await axios.get("/products");
            setProducts(data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleCheck = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all)
    }

    return (
        <>
            <Jumbotron title={"Hello World"} subTitle="Welcome to React E-commerce" />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <div className="position-sticky-top">
                            <h2 className="mb-2 mt-2 p-3 bg-light text-center h4">
                                Filter by Categories
                            </h2>

                            <div className="row px-5 py-3">
                                {categories?.map(c => (
                                    <Checkbox key={c._id} checked={checked.length && checked.includes(c._id)} onChange={e => handleCheck(e.target.checked, c._id)}>
                                        {c?.name}
                                    </Checkbox>
                                ))}
                            </div>

                            <h2 className="mb-2 mt-2 p-3 bg-light text-center h4">
                                Filter by Price
                            </h2>

                            <div className="row px-5 py-3">
                                <Radio.Group onChange={e => setRadio(e.target.value)} value={radio} >
                                    {prices?.map(p => (
                                        <div key={p._id} style={{ marginLeft: "8px" }}>
                                            <Radio value={p.array}>
                                                {p.name}
                                            </Radio>
                                        </div>
                                    ))}
                                </Radio.Group>
                            </div>

                            <div className="p-5">
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={() => {
                                        setChecked([]);
                                        setRadio(prices[0].array)
                                    }}
                                >
                                    Reset
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-9">

                        <h2 className="mb-2 mt-2 p-3 bg-light text-center h4 position-sticky-top">
                            {products?.length} Products
                        </h2>

                        {/* <div className="row" style={{ height: "90vh", overflowY: "scroll" }}> */}
                        <div className="row">
                            {products?.map(p => (
                                <div className="col-md-4" key={p._id}>
                                    <ProductCard p={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Shop;