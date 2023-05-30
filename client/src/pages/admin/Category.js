import { useEffect, useState } from "react";
import Jumbotron from "../../components/cards/Jambotron";
import AdminMenu from "../../components/nav/AdminMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/forms/CategoryForm";
import { Modal } from "antd";

const AdminCategory = () => {

    const [auth] = useAuth();

    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [categories, setCategoires] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updatingName, setUpdatingName] = useState("");

    useEffect(() => {
        loadCategories();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/category", { name });
            if (data?.error) {
                toast.error(data.error);
            } else {
                loadCategories()
                setName("")
                toast.success(`"${data.name}" is created`);
            }
        } catch (err) {
            console.log(err);
            toast.error("Create category failed. Try again");
        }
    }

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("categories");
            setCategoires(data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if(selected?.name === updatingName){
                return toast.error("Category name is same")
            }
            const { data } = await axios.put(`/category/${selected._id}`, { name: updatingName });
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is updated`);
                setSelected(null);
                setUpdatingName("");
                loadCategories();
                setVisible(false)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.delete(`/category/${selected._id}`);
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is deleted`);
                setSelected(null);
                loadCategories();
                setVisible(false);
            }
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

                        <div className="bg-light p-3 mb-2 mt-2 h4">Manage Categories</div>

                        <CategoryForm value={name} setValue={setName} handleSubmit={handleSubmit} />

                        <hr />

                        <div className="col">
                            {categories?.map(c => (
                                <button key={c._id} className="btn btn-outline-primary m-3" onClick={() => {
                                    setVisible(true);
                                    setSelected(c);
                                    setUpdatingName(c.name);
                                }}>
                                    {c.name}
                                </button>
                            ))}
                        </div>

                        <Modal open={visible} onCancel={() => setVisible(false)} footer={null}>
                            <div className="mt-4">
                                <CategoryForm
                                    value={updatingName}
                                    setValue={setUpdatingName}
                                    handleSubmit={handleUpdate}
                                    buttonText="Update"
                                    handleDelete={handleDelete}
                                />
                            </div>
                        </Modal>

                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminCategory;