import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import toast from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/AuthStyles.css'
const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        // This helps to prevent the page on getting refreshed when submit button is clicked.
        e.preventDefault();
        try {
            const res = await axios.post(`https://a2z-online-store.onrender.com/api/v1/auth/register`, {
                name,
                email,
                password,
                phone,
                address,
                answer,
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                navigate("/login");
            }
            else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    return (
        <Layout title="Registration Form">
            <div className='form-container mt-5 p-5'>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">REGISTER FORM</h4>
                    <div className="mb-3">
                        {/* <label htmlFor="exampleInputName" className="form-label">Name</label> */}
                        <input type="text" value={name} className="form-control" id="exampleInputName" placeholder='Enter your name' onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="email" value={email} className="form-control" id="exampleInputEmail" placeholder='Enter your email id' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={password} className="form-control" id="exampleInputPassword1" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={phone} className="form-control" id="exampleInputPhone" placeholder='Enter your phone number' onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="address" value={address} className="form-control" id="exampleInputAddress" placeholder='Enter your address' onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="address" value={answer} className="form-control" id="exampleInputText" placeholder='What is your date of birth?' onChange={(e) => setAnswer(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

            </div>
        </Layout>
    )
}

export default Register