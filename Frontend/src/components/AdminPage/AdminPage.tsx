import React, { useState } from 'react'
import Users from './Users';
import Bikes from './Bikes';

type Tabs = {
    name: string;
    component: JSX.Element;
}

const AdminPage: React.FC = (): JSX.Element => {
    const [activeTab, setActiveTab] = useState<number>(0)
    const tabs: Tabs[] = [
        {
            name: 'Users',
            component: <Users />
        },
        {
            name: 'Bikes',
            component: <Bikes/>
        },
        {
            name: 'Bookings',
            component: <div>Bookings</div>
        }
    ]
    return (
        <>
            <div className='d-flex flex-column flex-md-row h-100'>
                <AdminPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab}></AdminPanel>
                <div className='flex-grow-1 p-lg-5 p-2'>
                    {tabs[activeTab].component}
                </div>
            </div>
        </>
    )
}

type AdminPanelProp = {
    tabs: Tabs[];
    activeTab: number;
    onChange: (index: number) => void;
}

const AdminPanel: React.FC<AdminPanelProp> = ({ tabs, activeTab, onChange }): JSX.Element => {
    return (
        <ul className="nav nav-pills flex-column py-4 px-3 bg-mid-white h-100 bg-glass">
            {tabs.map((tab, index) => (
                <li className="nav-item mb-2" style={{ minWidth: '15rem' }} key={index}>
                    <div
                        className={`nav-link cursor-pointer bg-glass bg-light-white ${activeTab === index ? 'active bg-dark' : ' text-dark'}`}
                        onClick={() => onChange(index)}>{tab.name}</div>
                </li>
            ))}
        </ul>
    )
}

export default AdminPage