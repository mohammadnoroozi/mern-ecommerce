import { Badge } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth"
import { useCart } from "../../context/cart";
import useCategory from "../../hooks/useCategory";
import Search from "../forms/Search";

const Menu = () => {

    const [auth, setAuth] = useAuth();
    const [cart] = useCart();

    const navigate = useNavigate();
    const { categories } = useCategory();

    const logout = async () => {
        try {
            setAuth({ ...auth, user: null, token: "" });
            localStorage.removeItem("auth");
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <ul className="nav d-flex align-items-center justify-content-around shadow-sm mb-2 position-sticky-top-0 bg-light py-2">

            <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
            </li>

            <li className="nav-item">
                <NavLink className="nav-link" to="/shop">Shop</NavLink>
            </li>

            <div className="dropdown">

                <li>
                    <button className="pointer dropdown-toggle btn btn-link text-decoration-none" data-bs-toggle="dropdown">
                        Categories
                    </button>
                    <ul className="dropdown-menu text-center" style={{ height: "300px", overflowY: "scroll" }}>
                        <li>
                            <NavLink className={"nav-link d-inline-block"} to={`/categories`}>
                                All Categories
                            </NavLink>
                        </li>
                        {categories?.map(c => (
                            <li key={c._id}>
                                <NavLink className={"nav-link d-inline-block"} to={`/category/${c.slug}`}>
                                    {c.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </li>

            </div>

            <li className="nav-item">
                <Badge count={cart?.length} showZero={true}>
                    <NavLink className="nav-link" to="/cart">Cart</NavLink>
                </Badge>
            </li>

            <Search />

            {!auth?.user ? (
                <>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={"/login"}>Login</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/register">Register</NavLink>
                    </li>
                </>
            ) : (
                <div className="dropdown">

                    <li>
                        <button className="pointer dropdown-toggle btn btn-link text-decoration-none" data-bs-toggle="dropdown">
                            {auth?.user?.name}
                        </button>
                        <ul className="dropdown-menu text-center">
                            {auth?.user?.role === 1 ? (
                                <li className="my-2">
                                    <NavLink className="nav-link d-inline" to={`/dashboard/admin`}>
                                        Admin Panel
                                    </NavLink>
                                </li>
                            ) : null}
                            <li className="mt-2">
                                <NavLink className="nav-link d-inline" to={`/dashboard/user`}>
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="nav-item pointer text-center d-flex justify-content-center">
                                <button className="nav-link text-danger fw-bold btn text-center" onClick={logout} >Logout</button>
                            </li>
                        </ul>
                    </li>

                </div>
            )}

        </ul>

    );
}

export default Menu;