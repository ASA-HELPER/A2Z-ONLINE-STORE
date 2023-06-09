import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { Link } from 'react-router-dom'

const Products = () => {
    const [products, setProducts] = useState([])
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/get-product");
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong!!!')
        }
    }

    useEffect(() => {
        getAllProducts();
    }, [])
    return (
        <Layout title={"Dashboard - All Products"}>
            <div className='row dashboard m-3 pt-2'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Products List</h1>
                    <div className='d-flex flex-wrap'>
                        {products?.map((p) => (
                            <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className='product-link'>
                                <div className="card text-white bg-dark m-2" style={{ width: '18rem' }}>
                                    <img className="card-img-top" src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name.substring(0,30)}...</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products