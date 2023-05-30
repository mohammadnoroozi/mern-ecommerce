import axios from "axios";
import { useEffect, useState } from "react";
import Jumbotron from "../../components/cards/Jambotron";
import UserMenu from "../../components/nav/UserMenu";
import { useAuth } from "../../context/auth";
import moment from "moment";
import ProductCardHorizontal from "../../components/cards/ProductCardHorizontal";

const UserOrders = () => {

    const [auth] = useAuth();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token])

    const getOrders = async () => {
        try {
            const { data } = await axios.get("/orders");
            setOrders(data);
        } catch (err) {
            console.log(err);
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
                            Orders
                        </div>
                        {orders?.map((o, i) => (
                            <div className="bg-light shadow mb-5 rounded-4 border" key={i}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                #
                                            </th>
                                            <th scope="col">
                                                Status
                                            </th>
                                            <th scope="col">
                                                Buyer
                                            </th>
                                            <th scope="col">
                                                Ordered
                                            </th>
                                            <th scope="col">
                                                Payment
                                            </th>
                                            <th scope="col">
                                                Quantity
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {i + 1}
                                            </td>
                                            <td>
                                                {o?.status}
                                            </td>
                                            <td>
                                                {o?.buyer?.name}
                                            </td>
                                            <td>
                                                {moment(o?.createdAt).fromNow()}
                                            </td>
                                            <td>
                                                {o?.payment?.success ? "Success" : "Failed"}
                                            </td>
                                            <td>
                                                {o?.products?.length} products
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="container">
                                    <div className="row m-2 d-flex justify-content-center">
                                        {o?.products?.map((p, i) => (
                                            <ProductCardHorizontal key={i} p={p} remove={false} />
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserOrders;