import React from 'react';
import { LogInAndSingUpForm } from '../../pages/LogInPage.tsx';
import { adminLogin } from '../../scripts/API Calls/authApiCalls.ts';

interface LoginPageProps {
    onLogin?: () => void;
}

const AdminLoginPage: React.FC<LoginPageProps> = ({ onLogin = () => { } }) => {
    // form submit handlers
    async function loginUser(formData: { email: string, password: string }) {
        const { email, password } = formData;
        if (email && password) {
            alert("Please fill all the fields");
            return
        }

        if (email === '' || password === '') {
            alert("Please fill all the fields");
            return;
        }
        adminLogin(email.trim(), password, () => {
            onLogin();
        })
    }

    return (
        <div className='log-in-page form-container my-auto'>
            <h1>
                <p>Welcome to,</p>
                <p className='fw-bolder text-primary'>Bike Booker Admin</p>
            </h1>
            <LogInAndSingUpForm onLogInBtnClick={loginUser} onSignUpBtnClick={async () => { }} showSignUpForm={false} />
        </div>
    );
};

export default AdminLoginPage;