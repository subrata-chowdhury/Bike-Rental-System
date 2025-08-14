import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { getUser } from "../scripts/API Calls/userApiCalls";
import { User } from "../Types";
import logOut from "../scripts/logOut";
import bikeIcon from "../assets/bike.svg"
import userIcon from "../assets/user.svg"
import LogOutIcon from "../assets/reactIcons/LogOut";

const Menubar: React.FC = (): React.JSX.Element => {
    const menus = [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/about' },
        { name: 'Footer', link: '/' },
        { name: 'Contact', link: '/contact' },
    ]
    const [showSmallProfilePopup, setShowSmallProfilePopup] = useState(false);
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
        <nav className="navbar navbar-expand-sm bg-white navbar-light" style={{ zIndex: 10 }}>
            <div className="container">
                <Link to="/" className="navbar-brand fw-bold fs-4 me-5 text-dark d-flex justify-content-center align-items-center">
                    <img src={bikeIcon} className="me-2" width={40} height={40} alt="logo" />
                    Bike Rental
                </Link>
                <ul className="navbar-nav ms-2 me-auto">
                    <div className="d-flex w-100 justify-content-between">
                        <div
                            className="d-flex justify-content-center align-items-center float-end d-sm-none d-block me-1 cursor-pointer"
                            onClick={() => setShowMenus(val => !val)}>
                            <img src="./bars.svg" width={25} height={25}></img>
                        </div>
                    </div>
                    {
                        showMenus && menus.map((menu, index) => (
                            <li className="nav-item ms-2 me-2 d-flex justify-content-center" key={index}>
                                <Link to={menu.link} className="nav-link">{menu.name}</Link>
                            </li>
                        ))
                    }
                </ul>
                <div className="position-relative dropdown navbar-brand ms-3 me-2 cursor-pointer">
                    <img
                        src={userIcon}
                        width={35}
                        height={35}
                        className="p-2 rounded bg-dark dropdown-toggle"
                        alt="logout"
                        style={{ background: 'rgba(0,0,0,0.2)' }}
                        onClick={() => setShowSmallProfilePopup(val => !val)} />
                    <div
                        className={`dropdown-menu p-4 position-fixed bg-white ${showSmallProfilePopup ? 'show' : ''}`}
                        style={{ right: '60px', top: '60px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <MiniProfile />
                    </div>
                </div>
            </div>
        </nav>
    )
}

const MiniProfile: React.FC = (): React.JSX.Element => {
    const [userDetails, setUserDetails] = useState<User | null>(null);

    useEffect(() => {
        getUser().then(setUserDetails)
    }, [])

    if (!userDetails) return <Link to="/login" className="btn btn-primary w-100">Log In</Link>

    return (
        <div className="d-flex flex-column text-center">
            <img src={userIcon}
                width={60}
                height={60}
                className="p-3 mb-2 rounded rounded-circle dropdown-toggle mx-auto"
                style={{ background: 'rgba(0,0,0,0.2)' }}></img>
            <div><span className="fw-bold">Name:</span> {userDetails.username}</div>
            <div style={{wordBreak:'break-all'}}><span className="fw-bold" style={{wordBreak:'break-all'}}>Email:</span> {userDetails.email}</div>
            <Link to={'/profile'} className="btn btn-dark mt-2 border border-2 border-dark w-100">View Profile</Link>
            <button
                className="btn btn-outline-primary mt-2 border border-2 border-primary w-100 d-flex justify-content-center align-items-center"
                onClick={logOut}>
                Log Out
                <LogOutIcon size={18} className="ms-2" />
            </button>
        </div>
    )
}

export default Menubar