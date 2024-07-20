import React, { useEffect, useState } from "react";
import Menubar from "./Menubar";
import Footer from "./Footer";
import BikeCardsContainer from "./BikeCard";
import { getBookingHistoryByUserId, getBookingThatHasToReturn } from "../scripts/API Calls/bookingApiCalls";

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
                    <div className={`nav-link cursor-pointer ${activeTab === index ? 'active' : ''}`} onClick={() => setActiveTab(index)}>{tab.name}</div>
                </li>
            ))}
        </ul>
    )
}

const UserDetails: React.FC = (): JSX.Element => {
    return (
        <div>
            <h1>User Details</h1>
            <div className="d-flex flex-column">
                <div className="flex-grow-1">
                    <div className="form-group">
                        <label htmlFor="username">User Name</label>
                        <div className="input-group" id="username">
                            <input type="text" id="firstName" className="form-control bg-glass bg-deep-white" placeholder="First Name" />
                            <input type="text" id="lastName" className="form-control bg-glass bg-deep-white" placeholder="Last Name" />
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" className="form-control bg-glass bg-deep-white" placeholder="Email" />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" className="form-control bg-glass bg-deep-white" placeholder="Enter your password" />
                    </div>
                </div>
                <div className="mt-4">
                    <button className="btn btn-primary">Update Details</button>
                    <button className="btn btn-danger ms-3">Delete Account</button>
                </div>
            </div>
        </div>
    )
}

const BookingHistory: React.FC = (): JSX.Element => {
    const [bookingData, setBookingData] = useState<any[]>([]);
    const [allBookings, setAllBookings] = useState<any[]>([]);
    useEffect(() => {
        getBookingHistoryByUserId().then((data) => {
            setAllBookings(data);
            setBookingData(data.slice(0, 6))
        })
    }, [])
    return (
        <BikeCardsContainer bikeData={bookingData} noOfPages={Math.ceil(bookingData.length / 6)} onPageChange={i => {
            i = i - 0;
            setBookingData(allBookings.slice(i * 6, (i + 1) * 6))
        }} />
    )
}

const BikeToReturn: React.FC = (): JSX.Element => {
    const [bookingData, setBookingData] = useState<any[]>([]);
    const [allBookings, setAllBookings] = useState<any[]>([]);
    useEffect(() => {
        getBookingThatHasToReturn().then((data) => {
            setAllBookings(data);
            setBookingData(data.slice(0, 6))
        })
    }, [])
    return (
        <BikeCardsContainer bikeData={bookingData} noOfPages={Math.ceil(bookingData.length / 6)} onPageChange={i => {
            i = i - 0;
            setBookingData(allBookings.slice(i * 6, (i + 1) * 6))
        }} showReturnBtn={true} />
    )
}

export default ProfilePage