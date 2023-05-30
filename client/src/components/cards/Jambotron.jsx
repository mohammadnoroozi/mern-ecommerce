const Jumbotron = ({ title, subTitle = "Welcome to React E-commerce" }) => {
    return (
        <div className="container-fluid d-flex align-items-center justify-content-center w-100 jumbotron">
            <div className="row">
                <div className="col text-center p-4">
                    <h1 className="fw-bold title">{title}</h1>
                    <p className="lead">{subTitle}</p>
                </div>
            </div>
        </div>
    );
}

export default Jumbotron;