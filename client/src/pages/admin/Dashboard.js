import Jumbotron from "../../components/cards/Jambotron";
import AdminMenu from "../../components/nav/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {

    const [auth] = useAuth();

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
                            Admin Information
                        </div>
                        <ul className="list-group list-unstyled">
                            <li className="list-group-item">
                                {auth?.user?.name}
                            </li>
                            <li className="list-group-item">
                                {auth?.user?.email}
                            </li>
                            <li className="list-group-item">
                                Admin
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;