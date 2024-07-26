import React, { useEffect, useState } from "react";
import Menubar from "./Menubar";
import Footer from "./Footer";
import BikeCardsContainer from "./BikeCard";
import { getBookingHistoryByUserId, getBookingThatHasToReturn } from "../scripts/API Calls/bookingApiCalls";
import { getUser, updateUser } from "../scripts/API Calls/userApiCalls";
import { deleteUser } from "../scripts/API Calls/authApiCalls";

type Tabs = {
    name: string;
    component: JSX.Element;
}

const ProfilePage: React.FC = (): JSX.Element => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const tabs: Tabs[] = [{
        name: 'User Details',
        component: <UserDetails />
    }, {
        name: 'Booking History',
        component: <BookingHistory />
    }, {
        name: 'Bike to Return',
        component: <BikeToReturn />
    }]
    return (
        <div className="h-100 d-flex flex-column">
            <Menubar />
            <div className="container mt-4">
                <div className="d-flex flex-column flex-md-row">
                    <ProfileTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="flex-grow-1">
                        {tabs[activeTab].component}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

type ProfileTabsProp = {
    tabs: Tabs[];
    activeTab: number;
    setActiveTab: (index: number) => void;
}

const ProfileTabs: React.FC<ProfileTabsProp> = ({ tabs, activeTab, setActiveTab }): JSX.Element => {
    return (
        <ul className="nav nav-pills flex-column me-3">
            {tabs.map((tab, index) => (
                <li className="nav-item mb-1" key={index}>
                    <div className={`nav-link cursor-pointer ${activeTab === index ? 'active bg-secondary' : ' text-secondary'}`} onClick={() => setActiveTab(index)}>{tab.name}</div>
                </li>
            ))}
        </ul>
    )
}

export type UserDetails = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

const UserDetails: React.FC = (): JSX.Element => {
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

    const inputOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, [e.target.id]: e.target.value })
    }
    return (
        <div>
            <h1>User Details</h1>
            <div className="d-flex flex-column">
                <div className="flex-grow-1">
                    <div className="form-group">
                        <label htmlFor="username" className="mb-1 fw-bold">User Name</label>
                        <div className="input-group" id="username">
                            <input type="text" id="firstName" className="form-control bg-glass bg-deep-white" placeholder="First Name" value={userDetails.firstName} onChange={inputOnChangeHandler} />
                            <input type="text" id="lastName" className="form-control bg-glass bg-deep-white" placeholder="Last Name" value={userDetails.lastName} onChange={inputOnChangeHandler} />
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="email" className="mb-1 fw-bold">Email</label>
                        <input type="email" id="email" className="form-control bg-glass bg-deep-white" placeholder="Email" value={userDetails.email} onChange={inputOnChangeHandler} />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="password" className="mb-1 fw-bold">Password</label>
                        <input type="password" id="password" className="form-control bg-glass bg-deep-white" placeholder="Enter your password" value={userDetails.password} onChange={inputOnChangeHandler} />
                    </div>
                </div>
                <div className="mt-4">
                    <button className="btn btn-primary" onClick={() => {
                        if (userDetails.firstName.trim() === "" || userDetails.lastName.trim() === "" || userDetails.email.trim() === "" || userDetails.password.trim() === "") {
                            alert("Please fill in all the fields");
                            return;
                        }
                        updateUser(userDetails.firstName + ' ' + userDetails.lastName, userDetails.email, userDetails.password,
                            () => { alert('User details updated successfully') }
                        )
                    }}>Update Details</button>
                    <button className="btn btn-danger ms-3" onClick={() => {
                        if (window.confirm("Are you sure you want to delete your account?"))
                            deleteUser(() => { localStorage.removeItem('token'); window.location.href = '/' })
                    }}>Delete Account</button>
                </div>
            </div>
        </div>
    )
}

const BookingHistory: React.FC = (): JSX.Element => {
    const [bookingData, setBookingData] = useState<any[]>([]);
    const [allBookings, setAllBookings] = useState<any[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(0);
    useEffect(() => {
        getBookingHistoryByUserId().then((data) => {
            setAllBookings(data);
            setBookingData(data.slice(0, 6))
            setNoOfPages(Math.ceil(data.length / 6))
        })
    }, [])
    return (
        <BikeCardsContainer bikeData={bookingData} noOfPages={noOfPages} onPageChange={async i => {
            i = i - 1;
            setBookingData(allBookings.slice(i * 6, (i + 1) * 6))
        }} />
    )
}

const BikeToReturn: React.FC = (): JSX.Element => {
    const [bookingData, setBookingData] = useState<any[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(0);
    function getReturnBikesByIndex(index: number) {
        getBookingThatHasToReturn().then((data) => {
            setBookingData(data.slice(index * 6, (index + 1) * 6))
            setNoOfPages(Math.ceil(data.length / 6))
        })
    }
    useEffect(() => {
        getReturnBikesByIndex(0)
    }, [])
    return (
        <BikeCardsContainer bikeData={bookingData} noOfPages={noOfPages} onPageChange={async i => {
            i = i - 1;
            getReturnBikesByIndex(i)
        }} showReturnBtn={true} />
    )
}

export default ProfilePage