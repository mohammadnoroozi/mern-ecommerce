import axios from "axios";
import { useEffect, useState } from "react";
import Jumbotron from "../../components/cards/Jambotron";
import UserMenu from "../../components/nav/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";

const UserProfile = () => {

    const [auth, setAuth] = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (auth?.user) {
            const { name, email, address } = auth?.user;
            setName(name);
            setEmail(email);
            setAddress(address)
        }
    }, [auth?.user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put("/profile", {
                name,
                password,
                address
            })
            console.log(data);
            if (data?.error) {
                return toast.error(data.error);
            }

            setAuth({ ...auth, user: data });
            localStorage.setItem("auth", JSON.stringify({ ...auth, user: data }));
            toast.success("Profile updated")
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Jumbotron title={`Hello ${auth?.user?.name}`} subTitle="Dashboard" />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="bg-light p-3 mt-2 mb-2 h4">
                            Profile
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input
                                type={"text"}
                                className="form-control mb-3 p-2"
                                placeholder="Enter your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus={true}
                            />
                            <input
                                type={"email"}
                                className="form-control mb-3 p-2"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled
                            />
                            <input
                                type={"password"}
                                className="form-control mb-3 p-2"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />

                            <textarea
                                className="form-control mb-3 p-2"
                                placeholder="Enter your address"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                rows={5}
                            />

                            <button type="submit" className="btn btn-primary w-100 mb-5">
                                Submit
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserProfile;