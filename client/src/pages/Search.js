import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from 'react-hot-toast';
import '../styles/SearchedProductsStyles.css'
const Search = () => {
    const [values, setValues] = useSearch();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    return (
        <Layout title={"Search results"}>
            <div className="container mt-5 p-3">
                <div className="text-center mt-5">
                    <h1>Search Results</h1>
                    <h6>
                        {values?.results.length < 1
                            ? "No Products Found"
                            : `Found ${values?.results.length}`}
                    </h6>
                    <div className="d-flex flex-wrap mt-4 searched">
                        {values?.results.map((p) => (
                            <div className="card m-2" style={{ width: "18rem" }}>
                                <img
                                    src={`/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top"
                                    alt={p.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">
                                        {p.description.substring(0, 30)}...
                                    </p>
                                    <p className="card-price"> $ {p.price}</p>
                                    <div className="card-name-price">
                                        <button class="btn ms-1 btn-color" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                        <button class="btn btn-secondary ms-1" onClick={() => {
                                        setCart([...cart, p]);
                                        localStorage.setItem(
                                            "cart",
                                            JSON.stringify([...cart, p])
                                          );
                                        toast.success("Item Added to Cart");
                                    }}>ADD TO CART</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Search;