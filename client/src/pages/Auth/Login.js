import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import toast from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/AuthStyles.css'
import { useAuth } from '../../context/auth';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const handleSubmit = async (e) => {
        // This helps to prevent the page on getting refreshed when submit button is clicked.
        e.preventDefault();
        try {
            const res = await axios.post(`https://a2z-online-store.onrender.com/api/v1/auth/login`, {
                email,
                password,
            });
            if (res && res.data.success) {
                // toast.success("LogIn Successfully!!!")
                toast.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                })
                localStorage.setItem('auth', JSON.stringify(res.data))
                navigate(location.state || "/");
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
        <Layout title="Login Form">
            <div className='form-container mt-5 p-3'>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">LOGIN FORM</h4>
                    <div className="mb-3">
                        {/* <label htmlFor="exampleInputEmail" className="form-label">Email</label> */}
                        <input type="email" value={email} className="form-control" id="exampleInputEmail" placeholder='Enter your email id' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        {/* <label htmlFor="exampleInputPassword1" className="form-label">Password</label> */}
                        <input type="password" value={password} className="form-control" id="exampleInputPassword1" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className='mb-3'>
                        <button type="button" className="btn forgot-btn" onClick={() => { navigate('/forgot-password') }}>Forgot password</button>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

            </div>
        </Layout>
    )
}

export default Login