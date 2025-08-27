import React, { useEffect, useState } from "react";
import Menubar from "../components/Menubar.tsx";
import { deleteUser, getUser, updateUser } from "../scripts/API Calls/userApiCalls.ts";
import { User } from "../Types.ts";
import logOut from "../scripts/logOut.ts";
import userIcon from "../assets/user.svg"

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

export const ProfileTabs: React.FC<ProfileTabsProp> = ({ tabs, activeTab, onChange }): React.JSX.Element => {
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
            if (data)
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
        <div className="py-3 px-4 bg-white rounded-2 mb-3 d-flex flex-column shadow-md">
            <img src={userIcon}
                width={100}
                height={100}
                className="p-4 mb-2 rounded rounded-circle dropdown-toggle mx-auto"
                style={{ background: 'rgba(0,0,0,0.2)' }} />
            <h6 className="mb-0 text-center">{userDetails.username}</h6>
            <div className="text-center" style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>{userDetails.email}</div>
            <div className="form-group mt-2">
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
            <div className="mt-4 mb-1">
                <button className="btn btn-primary" onClick={() => {
                    onUpdate(userDetails);
                }}>Update Details</button>
                <button className="btn text-danger ms-3" style={{ fontWeight: 600 }} onClick={() => {
                    onDelete(userDetails);
                }}>Delete my Account</button>
            </div>
        </div>
    )
}

export default ProfilePage