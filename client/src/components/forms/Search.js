import axios from "axios";
import { useSearch } from "../../context/search"
import {useNavigate} from "react-router-dom"

const Search = () => {

    const [values, setValues] = useSearch();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`/products/search/${values?.keyword}`);
            setValues({ ...values, results: data })
            navigate("/search")
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control rounded-start rounded-end-0"
                    placeholder="Search"
                    value={values.keyword}
                    onChange={e => setValues({ ...values, keyword: e.target.value })}
                />
                <div className="input-group-prepend">
                    <button className="btn btn-outline-primary rounded-end rounded-start-0" type="submit">Search</button>
                </div>
            </div>
        </form>
    );
}

export default Search;