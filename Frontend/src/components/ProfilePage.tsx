import React, { Component, useState } from "react";
import Menubar from "./Menubar";
import Footer from "./Footer";
import BikeCardsContainer, { sampleData } from "./BikeCard";

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
        component: <BikeCardsContainerWrapper />
    }, {
        name: 'Delete Account',
        component: <div>Delete Account</div>
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

const BikeCardsContainerWrapper: React.FC = (): JSX.Element => {
    return (
        <BikeCardsContainer bikeData={sampleData} />
    )
}

const UserDetails: React.FC = (): JSX.Element => {
    return (
        <div>
            <h1>User Details</h1>
            <div className="d-flex">
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
                </div>
            </div>
        </div>
    )
}

export default ProfilePage