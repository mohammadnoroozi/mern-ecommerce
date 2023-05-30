import Jambotron from "../components/cards/Jambotron"
import { useSearch } from "../context/search";
import ProductCard from "../components/cards/ProductCard"

const Search = () => {

    const [values] = useSearch();

    return (
        <>
            <Jambotron
                title={"Search Results"}
                subTitle={values?.results?.length < 1 ? "No products found" : `Found ${values?.results?.length} products`}
            />
            <div className="container mt-3">
                <div className="row">
                    {values?.results?.map(p => (
                        <div className="col-md-4" key={p._id}>
                            <ProductCard p={p} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Search;