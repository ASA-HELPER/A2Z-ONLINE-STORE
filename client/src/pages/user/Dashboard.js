import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
const Dashboard = () => {
    const [auth, setAuth] = useAuth()
    return (
        <Layout title={'Your Dashboard'}>
            <div className='container-fluid mt-5 p-3 dashboard'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='card w-75 p-3'>
                            <h3>Name : {auth?.user?.name}</h3>
                            <h3>Email Id : {auth?.user?.email}</h3>
                            <h3>Address : {auth?.user?.address}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard