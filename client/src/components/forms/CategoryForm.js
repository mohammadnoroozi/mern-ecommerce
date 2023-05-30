const CategoryForm = ({ value, setValue, handleSubmit, buttonText = "Submit", handleDelete }) => {
    return (
        <div className="p-3">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-control p-2"
                    placeholder="Write category name"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                <div className="d-flex justify-content-between">
                    <button className="btn btn-primary w-100 mt-3" type="submit">
                        {buttonText}
                    </button>
                    {handleDelete ? (
                        <button className="btn btn-danger ms-2 w-100 mt-3" type="button" onClick={handleDelete}>
                            Delete
                        </button>
                    ) : null}
                </div>
            </form>
        </div>
    );
}

export default CategoryForm;