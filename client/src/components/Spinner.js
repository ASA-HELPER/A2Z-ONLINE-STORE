import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../components/SpinnerStyle.css'

const Spinner = ({ path = "login" }) => {
    const [count, setCount] = useState(3)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue)
        }, 1000);
        count === 0 && navigate(`/${path}`, {
            state: location.pathname,
        })
        return () => clearInterval(interval)
    }, [count, navigate, location, path])
    return (
        <>
            <h1 className='Text-center'>Redirecting you in {count} seconds</h1>
            <div className="loader loader4">
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            <div>
                                                <div>
                                                    <div />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Spinner