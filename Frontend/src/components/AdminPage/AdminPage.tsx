import React, { useEffect, useState } from 'react'
import LoginPage from './LoginPage';
import { getUser } from '../../scripts/API Calls/userApiCalls.ts';


export type Tabs = {
    name: string;
    icon: React.ReactNode;
    component: React.JSX.Element;
}

const AdminPageWrapper: React.FC = (): React.JSX.Element => {
    const [isLogin, setIsLogin] = useState<boolean>(false)
    // Check if user is already logged in
    useEffect(() => {
        getUser().then((user) => {
            if (user) {
                setIsLogin(true);
            } else {
                setIsLogin(false);
            }
        }).catch(() => {
            setIsLogin(false);
        })
    }, [])
    return (
        <>
            {isLogin ? <AdminPage /> : <LoginPage onLogin={() => setIsLogin(true)} />}
        </>
    )
}

interface AdminPageProp {
}

const AdminPage: React.FC<AdminPageProp> = ({ }): React.JSX.Element => {

    return (
        <>
            <div className='d-flex flex-column flex-grow-1 flex-md-row h-100'>
                <div className='flex-grow-1'>
                </div>
            </div>
        </>
    )
}

export default AdminPageWrapper;