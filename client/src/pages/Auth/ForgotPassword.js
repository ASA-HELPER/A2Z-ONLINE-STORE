import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import toast from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/AuthStyles.css'
import { useAuth } from '../../context/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        // This helps to prevent the page on getting refreshed when submit button is clicked.
        e.preventDefault();
        try {
            const res = await axios.post(`https://a2z-online-store.onrender.com/api/v1/auth/forgot-password`, {
                email,
                newPassword,
                answer,
            });
            if (res && res.data.success) {
                // toast.success("LogIn Successfully!!!")
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
        <Layout title={"Forgot Password"}>
            <div className='form-container mt-5 p-3'>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">RESET PASSWORD</h4>
                    <div className="mb-3">
                        {/* <label htmlFor="exampleInputEmail" className="form-label">Email</label> */}
                        <input type="email" value={email} className="form-control" id="exampleInputEmail" placeholder='Enter your email id' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        {/* <label htmlFor="exampleInputPassword1" className="form-label">Password</label> */}
                        <input type="password" value={newPassword} className="form-control" id="exampleInputPassword1" placeholder='Enter your new password' onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        {/* <label htmlFor="exampleInputPassword1" className="form-label">Password</label> */}
                        <input type="text" value={answer} className="form-control" id="exampleInputPassword1" placeholder='What is your date of birth?' onChange={(e) => setAnswer(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                </form>

            </div>
        </Layout>
    )
}

export default ForgotPassword