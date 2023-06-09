import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import MainLogo from '../../images/Mainlogo.PNG'
import SearchInput from '../Form/SearchInput'
import useCategory from '../../hooks/useCategory'
import { useCart } from '../../context/cart'
import { Badge } from 'antd'
import {ShoppingCartOutlined} from '@ant-design/icons'
const Header = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart()
    const categories = useCategory()
    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: ""
        })
        localStorage.removeItem('auth')
        toast.success("Logout Successfully!!!")
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <Link to="/" className="navbar-brand"> <img src={MainLogo} alt="" /> A2Z ONLINE STORE</Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <SearchInput />
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">Home</NavLink>
                            </li>

                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" to={"/categories"}>
                                    Categories
                                </Link>
                                <ul className='dropdown-menu'>
                                    <li><Link className="dropdown-item" to={`/categories`}>All Categories</Link></li>
                                    {categories.map((c) => {
                                            <li><Link className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</Link></li>
                                    })}
                                </ul>
                            </li>

                            {
                                !auth.user ? (
                                    <>
                                        <li className="nav-item">
                                            <NavLink to="/register" className="nav-link">SignUp</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/login" className="nav-link">Login</NavLink>
                                        </li>
                                    </>
                                ) : (<>

                                    <li className="nav-item dropdown">
                                        <NavLink className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {auth?.user?.name}
                                        </NavLink>
                                        <ul className='dropdown-menu'>
                                            <li>
                                                <NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item">DashBoard</NavLink>
                                            </li>
                                            <div className="dropdown-divider" />
                                            <li>
                                                <NavLink to="/login" className="dropdown-item" onClick={handleLogout}>LogOut</NavLink>
                                            </li>
                                        </ul>
                                    </li>
                                </>)
                            }
                            <li className="nav-item">
                                {!auth.user?(
                                    <NavLink to="/cart" className="nav-link">
                                        <Badge showZero offset={[10, -5]}>
                                            <ShoppingCartOutlined style={{ fontSize: '25px'}}/>
                                        </Badge>
                                    </NavLink>
                                ):(
                                    <NavLink to="/cart" className="nav-link">
                                        <Badge count={cart?.length} showZero offset={[10, -5]}>
                                            <ShoppingCartOutlined style={{ fontSize: '25px'}}/>
                                        </Badge>
                                    </NavLink>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header