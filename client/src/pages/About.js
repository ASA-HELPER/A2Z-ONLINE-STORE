import React from 'react'
import Layout from '../components/Layout/Layout'
import MainLogo from '../images/Mainlogo.PNG'
const About = () => {
    return (
        <Layout title={"About us"}>
            <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src={MainLogo}
            alt="contactus"
            style={{ width: "100%", height: "300px",marginTop:"50px",borderRadius:"50%" }}
          />
        </div>
        <div className="col-md-4">
        <h1 className="bg-dark p-2 text-center" style={{color:"#cbb26a"}}>ABOUT US</h1>
          <p className="text-justify mt-2">
          We provide a seamless shopping experience with a wide range of products, easy payment options, and fast delivery. With a user-friendly interface, personalized recommendations, and round-the-clock customer support, you can shop from the comfort of your home and get everything you need at the click of a button.
          </p>
        </div>
      </div>
        </Layout>
    )
}

export default About