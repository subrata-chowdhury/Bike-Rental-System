import LogOutIcon from '../../assets/reactIcons/LogOut';
import UserIcon from '../../assets/reactIcons/User';
import BikeIcon from '../../assets/reactIcons/Bike';
import BookingIcon from '../../assets/reactIcons/Booking';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '../../assets/reactIcons/Home';

export type Tabs = {
    href: string;
    icon: React.ReactNode;
    matcher?: string;
}

interface AdminPanelProp {
    tabs?: Tabs[];
}

const tabsData: Tabs[] = [{
    href: '/admin',
    icon: <HomeIcon size={20} />,
},
{
    href: '/admin/users',
    icon: <UserIcon size={20} />,
},
{
    href: '/admin/bikes',
    icon: <BikeIcon size={24} />,
    matcher: '/admin/bikes'
},
{
    href: '/admin/bookings',
    icon: <BookingIcon size={20} />,
},
{
    href: '/admin/return-requests',
    icon: <BookingIcon size={20} />,
}]

export const AdminPanel: React.FC<AdminPanelProp> = ({ tabs = tabsData }): React.JSX.Element | null => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentTab = location.pathname;

    if (!location.pathname.includes('admin')) return null;

    return (
        <ul className="nav nav-pills flex-column py-4 px-3 bg-white h-100 border-r border" style={{ minHeight: '100vh' }}>
            {tabs.map((tab, index) => (
                <Link to={tab.href} className="nav-item mb-2" title={tab.href.charAt(0).toUpperCase() + tab.href.slice(1)} key={index}>
                    <div className={`nav-link cursor-pointer bg-glass bg-light-white p-2 d-flex justify-content-center align-items-center ${(currentTab === tab.href || (tab.matcher && currentTab.indexOf(tab.matcher) > -1)) ? 'active text-white bg-dark' : ' text-dark'}`}>{tab.icon}</div>
                </Link>
            ))}
            <button className='btn btn-dark mt-auto py-2 d-flex justify-content-center align-items-center' onClick={() => { localStorage.removeItem('adminToken'); navigate('/') }}><LogOutIcon size={18} /></button>
        </ul>
    )
}