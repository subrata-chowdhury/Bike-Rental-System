import React, { useEffect, useState } from 'react'
import Users from './Users';
import Bikes from './Bikes';
import LoginPage from './LoginPage';
import Booking from './Booking';
import UserIcon from '../../assets/reactIcons/User';
import BikeIcon from '../../assets/reactIcons/Bike';
import BookingIcon from '../../assets/reactIcons/Booking';
import LogOutIcon from '../../assets/reactIcons/LogOut';


type Tabs = {
    name: string;
    icon: React.ReactNode;
    component: React.JSX.Element;
}

const AdminPageWrapper: React.FC = (): React.JSX.Element => {
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

const AdminPage: React.FC<AdminPageProp> = ({ logout }): React.JSX.Element => {
    const [activeTab, setActiveTab] = useState<number>(0)
    const tabs: Tabs[] = [
        {
            name: 'Users',
            icon: <UserIcon size={24} />,
            component: <Users logout={logout} />
        },
        {
            name: 'Bikes',
            icon: <BikeIcon size={24} />,
            component: <Bikes />
        },
        {
            name: 'Bookings',
            icon: <BookingIcon size={20} />,
            component: <Booking />
        }
    ]
    return (
        <>
            <div className='d-flex flex-column flex-grow-1 flex-md-row h-100'>
                <AdminPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} logout={logout} />
                <div className='flex-grow-1 p-2'>
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

const AdminPanel: React.FC<AdminPanelProp> = ({ tabs, activeTab, onChange, logout }): React.JSX.Element => {
    return (
        <ul className="nav nav-pills flex-column py-4 px-3 bg-white h-100" style={{ minHeight: '100vh' }}>
            {tabs.map((tab, index) => (
                <li className="nav-item mb-2" title={tab.name} key={index}>
                    <div
                        className={`nav-link cursor-pointer bg-glass bg-light-white p-2 d-flex justify-content-center align-items-center ${activeTab === index ? 'active text-white bg-dark' : ' text-dark'}`}
                        onClick={() => onChange(index)}>{tab.icon}</div>
                </li>
            ))}
            <button className='btn btn-dark mt-auto py-2 d-flex justify-content-center align-items-center' onClick={logout}><LogOutIcon size={18} /></button>
        </ul>
    )
}

export default AdminPageWrapper