import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
    return (
        <div className='footer'>
            <p className='text-center mt-3'>
                <Link to="/about">About</Link>|
                <Link to="/contact">Contact</Link>|
                <Link to="/policy">Privacy Policy</Link>
            </p>
            <h3 className='text-center' style={{ color: '#CBB26A' }}>A2Z ONLINE STORE</h3>
            <h4 className='text-center'>&copy;All Rights Reserved</h4>
        </div>
    )
}

export default Footer