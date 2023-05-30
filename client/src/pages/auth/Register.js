import { useState } from "react";
import Jumbotron from "../../components/cards/Jambotron";
import axios from "axios";
import toast from "react-hot-toast"
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/register', {
                name,
                email,
                password
            });
            if (data?.error) {
                toast.error(data.error)
            } else {
                localStorage.setItem("auth", JSON.stringify(data));
                setAuth({ ...auth, token: data.token, user: data.user });
                toast.success("Registration successful");
                navigate(`/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`);
            }
        } catch (err) {
            console.log(err);
            toast.error("Registration failed. Try again")
        }
    }


    return (
        <div>
            <Jumbotron title={"Register"} />

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <form onSubmit={handleSubmit}>
                            <input
                                type={"text"}
                                className="form-control p-2 mb-4"
                                placeholder="Enter your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />

                            <input
                                type={"email"}
                                className="form-control p-2 mb-4"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <input
                                type={"password"}
                                className="form-control p-2 mb-4"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />

                            <button className="btn btn-primary w-100">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}