import React, { useEffect, useState } from 'react'
import Users from './Users';
import Bikes from './Bikes';
import LoginPage from './LoginPage';
import Booking from './Booking';

type Tabs = {
    name: string;
    component: JSX.Element;
}

const AdminPageWrapper: React.FC = (): JSX.Element => {
    const [isLogin, setIsLogin] = useState<boolean>(false)
    // Check if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('adminToken')) {
            setIsLogin(true)
        }
    }, [])
    return (
        <>
            {isLogin ? <AdminPage logout={() => {
                localStorage.removeItem('adminToken')
                setIsLogin(false)
            }} /> : <LoginPage onLogin={() => setIsLogin(true)} />}
        </>
    )
}

interface AdminPageProp {
    logout: () => void;
}

const AdminPage: React.FC<AdminPageProp> = ({ logout }): JSX.Element => {
    const [activeTab, setActiveTab] = useState<number>(0)
    const tabs: Tabs[] = [
        {
            name: 'Users',
            component: <Users logout={logout} />
        },
        {
            name: 'Bikes',
            component: <Bikes />
        },
        {
            name: 'Bookings',
            component: <Booking />
        }
    ]
    return (
        <>
            <div className='d-flex flex-column flex-md-row h-100'>
                <AdminPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} logout={logout}></AdminPanel>
                <div className='flex-grow-1 p-lg-5 p-2'>
                    {tabs[activeTab].component}
                </div>
            </div>
        </>
    )
}

interface AdminPanelProp {
    tabs: Tabs[];
    activeTab: number;
    onChange: (index: number) => void;
    logout: () => void;
}

const AdminPanel: React.FC<AdminPanelProp> = ({ tabs, activeTab, onChange, logout }): JSX.Element => {
    return (
        <ul className="nav nav-pills flex-column py-4 px-3 bg-mid-white h-100 bg-glass">
            {tabs.map((tab, index) => (
                <li className="nav-item mb-2" style={{ minWidth: '15rem' }} key={index}>
                    <div
                        className={`nav-link cursor-pointer bg-glass bg-light-white ${activeTab === index ? 'active bg-dark' : ' text-dark'}`}
                        onClick={() => onChange(index)}>{tab.name}</div>
                </li>
            ))}
            <button className='btn btn-dark mt-auto' onClick={() => {
                logout()
            }}>Log Out</button>
        </ul>
    )
}

export default AdminPageWrapper