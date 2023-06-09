import React from 'react'
import Layout from '../components/Layout/Layout'
import MainLogo from '../images/Mainlogo.PNG'
const Policy = () => {
    return (
      <Layout title={"Privacy Policy"}>
        <div className="row contactus mt-5">
          <div className="col-md-6 ">
            <img
              src={MainLogo}
              alt="contactus"
              style={{ width: "100%", height: "300px",marginTop:"50px",borderRadius:"50%"}}
            />
          </div>
          <div className="col-md-4">
            <p>We collect personal information such as name, address, and payment information only for the purpose of processing and fulfilling orders. We never share or sell this information to third parties.</p>
            <p>We use industry-standard security measures to protect personal information from unauthorized access or disclosure. This includes the use of encryption and secure data storage.</p>
            <p>We retain personal information only for as long as necessary to fulfill orders and for legal and accounting purposes. After this period, personal information is securely destroyed.</p>
          </div>
        </div>
    </Layout>
    )
}

export default Policy