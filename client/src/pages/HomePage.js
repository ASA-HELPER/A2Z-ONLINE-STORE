import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from 'react-hot-toast';
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [cart, setCart] = useCart();

    //get all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    //getTOtal COunt
    const getTotal = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/product-count");
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);
    //load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // filter by cat
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };
    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);

    //get filterd product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post("/api/v1/product/product-filters", {
                checked,
                radio,
            });
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Layout title={"All Products - Best offers"}>
            <img
                src="https://static.vecteezy.com/system/resources/previews/004/299/835/original/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-free-vector.jpg"
                className="banner-img mt-5"
                alt="bannerimage"
                width={"100%"}
            />
            <div className="container-fluid row mt-3 home-page">
                <div className="col-md-3 filters">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <Checkbox
                                key={c._id}
                                onChange={(e) => handleFilter(e.target.checked, c._id)}
                            >
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    {/* price filter */}
                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex flex-column">
                        <button
                            className="btn btn-danger"
                            onClick={() => window.location.reload()}
                        >
                            RESET FILTERS
                        </button>
                    </div>
                </div>
                <div className="col-md-9">
                    <h1 className="text-center">All Products</h1>
                    <div className="d-flex flex-wrap" id="searched">
                        {products?.map((p) => (
                            <div className="card m-1" key={p._id}>
                                {loading?(
                                    <img
                                    src="https://c.tenor.com/Gw-jI11oSC8AAAAC/loading-now-loading.gif"
                                    className="card-img-top"
                                    alt={p.name}
                                />
                                ):(
                                    <img
                                    src={`/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top"
                                    alt={p.name}
                                />
                                )}
                                <div className="card-body">
                                <div className="card-name-price">
                                    <h5 className="card-title">{p.name}</h5>
                                    <h5 className="card-title card-price">
                                        {p.price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </h5>
                                    </div>
                                    <p className="card-text">
                                        {p.description.substring(0, 30)}...
                                    </p>
                                    <div className="card-name-price">
                                    <button className="btn ms-1 btn-color" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    <button className="btn btn-dark ms-1" onClick={() => {
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
                    <div className="m-2 p-3">
                        {products && products.length < total && (
                            <button
                                className="btn loadmore"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                                }}
                            >
                                {loading ? (
                                    "Loading ..."
                                    ) : (
                                    <>
                                        {" "}
                                        Loadmore <AiOutlineReload />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default HomePage