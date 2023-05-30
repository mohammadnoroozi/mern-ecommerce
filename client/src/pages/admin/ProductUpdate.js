import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Jumbotron from "../../components/cards/Jambotron";
import AdminMenu from "../../components/nav/AdminMenu";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
import toast from "react-hot-toast"

const { Option } = Select;


const AdminProductUpdate = () => {

    const [auth] = useAuth();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [shipping, setShipping] = useState("");
    const [quantity, setQuantity] = useState("");
    const [id, setId] = useState("");

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        loadProduct();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("categories");
            setCategories(data);
        } catch (err) {
            console.log(err);
        }
    }

    const loadProduct = async () => {
        try {
            const { data } = await axios.get(`/product/${params.slug}`);
            console.log(data);
            setName(data.name);
            setDescription(data.description);
            setCategory(data.category._id);
            setPrice(data.price);
            setQuantity(data.quantity);
            setShipping(data.shipping);
            setId(data._id)
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = async () => {
        try {
            const productData = new FormData();
            photo && productData.append("photo", photo);
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("category", category);
            productData.append("shipping", shipping);
            productData.append("quantity", quantity);

            const { data } = await axios.put(`/product/${id}`, productData);

            if (data?.error) {
                return toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is updated`);
                navigate("/dashboard/admin/products");
            }

        } catch (err) {
            console.log(err);
            toast.error("Product create failed. Try again")
        }
    }

    const handleDelete = async () => {
        try {
            const answer = window.confirm("Are you sure you want to delete this product?");
            if (!answer) return;
            const { data } = await axios.delete(`/product/${id}`);
            console.log(data);
            toast.success(`"${data?.name}" is deleted`);
            navigate("/dashboard/admin/products")
        } catch (err) {
            console.log(err);
        }
    }

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
                            Update Product
                        </div>

                        {photo ? (
                            <div className="text-center">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="Product"
                                    height={"200px"}
                                    className="img img-responsive rounded"
                                />
                            </div>
                        ) : (
                            <div className="text-center">
                                <img
                                    src={`${process.env.REACT_APP_API}/product/photo/${id}`}
                                    alt="Product"
                                    height={"200px"}
                                    className="img img-responsive rounded"
                                />
                            </div>
                        )}

                        <div className="pt-2">
                            <label className="btn btn-outline-primary p-2 col-12 mb-3">
                                {photo ? photo.name : "Upload Image"}
                                <input
                                    type={"file"}
                                    name="photo"
                                    accept="image/*"
                                    onChange={e => setPhoto(e.target.files[0])}
                                    hidden
                                />
                            </label>
                        </div>

                        <input
                            type="text"
                            className="form-control mb-3 p-2"
                            placeholder="Write a name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <textarea
                            className="form-control mb-3 p-2"
                            placeholder="Write a description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                        />

                        <input
                            type="number"
                            className="form-control mb-3 p-2"
                            placeholder="Enter price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />

                        <Select
                            bordered={false}
                            className="form-select mb-3"
                            placeholder="Choose category"
                            showSearch={true}
                            onChange={(value) => setCategory(value)}
                            value={category}
                        >
                            {categories?.map(c => (
                                <Option key={c._id} value={c._id}>
                                    {c.name}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            bordered={false}
                            className="form-select mb-3"
                            // placeholder={shipping ? shipping ? "Yes" : "No" : "Choose shipping"}
                            placeholder={"Choose shipping"}
                            onChange={(value) => setShipping(value)}
                            value={shipping === "1" ? "Yes" : "No"}
                        >
                            <Option value={"0"}>No</Option>
                            <Option value={"1"}>Yes</Option>
                        </Select>

                        <input
                            type="number"
                            className="form-control mb-3 p-2"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            min={"1"}
                        />

                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary w-25 mb-5" onClick={handleSubmit}>
                                Update
                            </button>
                            <button className="btn btn-danger w-25 mb-5" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminProductUpdate;