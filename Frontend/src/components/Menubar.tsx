import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { UserDetails } from "./ProfilePage";
import { getUser } from "../scripts/API Calls/userApiCalls";

const Menubar: React.FC = (): JSX.Element => {
    const menus = [
        { name: 'Home', link: '/Home' },
        { name: 'About', link: '/' },
        { name: 'Footer', link: '/' },
        { name: 'Contact', link: '/' },
    ]

    const [showMenus, setShowMenus] = useState(false);
    useEffect(() => {
        window.onresize = () => {
            if (window.innerWidth > 576) {
                setShowMenus(true)
            } else {
                setShowMenus(false)
            }
        }
        
        if (window.innerWidth > 576) {
            setShowMenus(true)
        } else {
            setShowMenus(false)
        }
    }, [])

    return (
        <nav className="navbar navbar-expand-sm bg-glass bg-deep-white navbar-light" style={{ zIndex: 10 }}>
            <div className="container-fluid">
                <ul className="navbar-nav w-100">
                    <div className="d-flex w-100 justify-content-between">
                        <div className="dropdown navbar-brand ms-3 me-2 cursor-pointer">
                            <img
                                src="user.svg"
                                width={35}
                                height={35}
                                className="p-2 rounded dropdown-toggle"
                                alt="logout"
                                style={{ background: 'rgba(0,0,0,0.2)' }}
                                id='smallProfileSection'
                                data-bs-toggle='dropdown'
                                aria-expanded='false' />
                            <ul className="dropdown-menu p-4" aria-labelledby='dropdownMenuButton1'>
                                <MiniProfile />
                            </ul>
                        </div>

                        <div className="d-flex justify-content-center align-items-center float-end d-sm-none d-block me-1 cursor-pointer" onClick={e => setShowMenus(val => !val)}>
                            <img src="./bars.svg" width={25} height={25}></img>
                        </div>
                    </div>
                    {
                        showMenus && menus.map((menu, index) => (
                            <li className="nav-item ms-3 d-flex justify-content-center" key={index}>
                                <Link to={menu.link} className="nav-link">{menu.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </nav>
    )
}

const MiniProfile: React.FC = (): JSX.Element => {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        getUser().then(data => {
            setUserDetails({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: ""
            })
        })
    }, [])

    const logout = (): void => {
        localStorage.removeItem('token')
        window.location.href = '/';
        const navigate = useNavigate()
        navigate('/')
    }

    return (
        <div className="d-flex flex-column text-center">
            <img src="user.svg"
                width={60}
                height={60}
                className="p-3 mb-2 rounded rounded-circle dropdown-toggle mx-auto"
                style={{ background: 'rgba(0,0,0,0.2)' }}></img>
            <div><span className="fw-bold">Name:</span> {userDetails.firstName} {userDetails.lastName}</div>
            <div><span className="fw-bold">Email:</span> {userDetails.email}</div>
            <Link to={'/Profile'} className="btn btn-outline-secondary mt-2 border border-2 border-secondary w-100">View Profile</Link>
            <button className="btn btn-outline-primary mt-2 border border-2 border-primary w-100 d-flex justify-content-center align-items-center" onClick={logout}>
                Log Out
                <img src="log-out.svg" width={18} height={18} className="ms-2"></img>
            </button>
        </div>
    )
}

export default Menubar