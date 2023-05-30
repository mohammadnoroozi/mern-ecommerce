import Jumbotron from "../../components/cards/Jambotron";
import UserMenu from "../../components/nav/UserMenu";
import { useAuth } from "../../context/auth";

const UserDashboard = () => {

    const [auth] = useAuth();

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
                            User Information
                        </div>
                        <ul className="list-group list-unstyled">
                            <li className="list-group-item">
                                {auth?.user?.name}
                            </li>
                            <li className="list-group-item">
                                {auth?.user?.email}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserDashboard;