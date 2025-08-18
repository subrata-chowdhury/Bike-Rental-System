import React, { useEffect, useState } from "react";
import Menubar from "./Menubar";
import BikeCardsContainer from "./BikeCard";
import { getBookingHistoryByUserId, getBookingThatHasToReturn } from "../scripts/API Calls/bookingApiCalls.ts";
import { deleteUser, getUser, updateUser } from "../scripts/API Calls/userApiCalls.ts";
import { Bike, BookingData, User } from "../Types";
import logOut from "../scripts/logOut";

type Tabs = {
    name: string;
    component: React.JSX.Element;
}

const ProfilePage: React.FC = (): React.JSX.Element => {
    const [activeTab, setActiveTab] = useState<number>(0);

    async function updateUserDetails(userDetails: User) {
        userDetails.email = userDetails.email.trim();

        if (userDetails.username === "" || userDetails.email === "" || userDetails.password === "") {
            alert("Please fill in all the fields");
            return;
        }

        updateUser(userDetails.username, userDetails.email, userDetails.password,
            () => { alert('User details updated successfully') }
        )
    }

    async function deleteUserAccount(userDetails: User) {
        userDetails.password = userDetails.password.trim();
        if (userDetails.password === "") {
            alert("Please enter your password to delete your account");
            return
        }
        if (window.confirm("Are you sure you want to delete your account?"))
            deleteUser(userDetails.password, () => { localStorage.removeItem('token'); window.location.href = '/' })
    }

    const tabs: Tabs[] = [{
        name: 'User Details',
        component: <UserDetails onUpdate={updateUserDetails} onDelete={deleteUserAccount} />
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
                    <ProfileTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                    <div className="flex-grow-1">
                        {tabs[activeTab].component}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface ProfileTabsProp {
    tabs: Tabs[],
    activeTab: number,
    onChange: (index: number) => void
}

const ProfileTabs: React.FC<ProfileTabsProp> = ({ tabs, activeTab, onChange }): React.JSX.Element => {
    return (
        <ul className="nav nav-pills flex-column me-3">
            {tabs.map((tab, index) => (
                <li className="nav-item mb-2" key={index}>
                    <div
                        className={`nav-link cursor-pointer ${activeTab === index ? 'active bg-dark' : ' text-dark bg-white'}`}
                        onClick={() => onChange(index)}>{tab.name}</div>
                </li>
            ))}
        </ul>
    )
}


type UserDetailsProp = {
    onUpdate: (userDetails: User) => Promise<void>;
    onDelete: (userDetails: User) => Promise<void>;
}

const UserDetails: React.FC<UserDetailsProp> = ({ onUpdate, onDelete }): React.JSX.Element => {
    const [userDetails, setUserDetails] = useState<User>({
        _id: "",
        username: " ",
        email: "",
        password: "",
        role: ""
    });

    useEffect(() => {
        getUser().then(data => {
            if(data)
                setUserDetails(data)
            else 
                logOut()
        })
    }, [])

    const inputOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.id) {
            case 'firstName':
                setUserDetails({ ...userDetails, username: e.target.value.trim() + ' ' + userDetails.username.split(' ')[1] })
                break;
            case 'lastName':
                setUserDetails({ ...userDetails, username: userDetails.username.split(' ')[0] + ' ' + e.target.value.trim() })
                break;
            default:
                setUserDetails({ ...userDetails, [e.target.id]: e.target.value })
        }
    }

    return (
        <div className="py-1 px-4 bg-white rounded-2 mb-3">
            <h1>User Details</h1>
            <div className="d-flex flex-column mb-4">
                <div className="flex-grow-1">
                    <div className="form-group">
                        <label htmlFor="username" className="mb-1 fw-bold">User Name</label>
                        <div className="input-group" id="username">
                            <input
                                type="text"
                                id="firstName"
                                className="form-control bg-glass bg-deep-white"
                                placeholder="First Name"
                                value={userDetails.username.split(' ')[0]}
                                onChange={inputOnChangeHandler} />
                            <input
                                type="text"
                                id="lastName"
                                className="form-control bg-glass bg-deep-white"
                                placeholder="Last Name"
                                value={userDetails.username.split(' ')[1]}
                                onChange={inputOnChangeHandler} />
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="email" className="mb-1 fw-bold">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control bg-glass bg-deep-white"
                            placeholder="Email"
                            value={userDetails.email}
                            onChange={inputOnChangeHandler} />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="password" className="mb-1 fw-bold">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control bg-glass bg-deep-white"
                            placeholder="Enter your password"
                            value={userDetails.password}
                            onChange={inputOnChangeHandler} />
                    </div>
                </div>
                <div className="mt-4">
                    <button className="btn btn-primary" onClick={() => {
                        onUpdate(userDetails);
                    }}>Update Details</button>
                    <button className="btn btn-danger ms-3" onClick={() => {
                        onDelete(userDetails);
                    }}>Delete Account</button>
                </div>
            </div>
        </div>
    )
}

const BookingHistory: React.FC = (): React.JSX.Element => {
    const [bookingData, setBookingData] = useState<BookingData[]>([]);
    const [allBookings, setAllBookings] = useState<BookingData[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(0);
    useEffect(() => {
        getBookingHistoryByUserId((data) => {
            setAllBookings(data);
            setBookingData(data.slice(0, 6))
            setNoOfPages(Math.ceil(data.length / 6))
        })
    }, [])
    return (
        <BikeCardsContainer
            bikeData={bookingData}
            noOfPages={noOfPages}
            onPageChange={async i => {
                i = i - 1;
                setBookingData(allBookings.slice(i * 6, (i + 1) * 6))
            }} />
    )
}

const BikeToReturn: React.FC = (): React.JSX.Element => {
    const [bookingData, setBookingData] = useState<Bike[]>([]);
    const [noOfPages, setNoOfPages] = useState<number>(0);

    function getReturnBikesByIndex(index: number) {
        getBookingThatHasToReturn((bikesData: Bike[]) => {
            setBookingData(bikesData.slice(index * 6, (index + 1) * 6))
            setNoOfPages(Math.ceil(bikesData.length / 6))
        })
    }

    useEffect(() => {
        getReturnBikesByIndex(0)
    }, [])

    return (
        <BikeCardsContainer
            bikeData={bookingData}
            noOfPages={noOfPages}
            onPageChange={async i => {
                i = i - 1;
                getReturnBikesByIndex(i)
            }}
            showReturnBtn={true} />
    )
}

export default ProfilePage