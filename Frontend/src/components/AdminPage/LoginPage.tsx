import React from 'react';
import { LogInAndSingUpForm } from '../LogInPage';
import { verifyFieldsForLogIn } from '../../scripts/InputsVerifires';
import { adminLogin } from '../../scripts/API Calls/authApiCalls';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    // form submit handlers
    async function loginUser(formData: { email: string, password: string }) {
        const { email, password } = formData;
        if (email && password)
            verifyFieldsForLogIn(email, password) ?
                adminLogin(email.trim(), password, () => {
                    onLogin();
                }) : ""
    }

    return (
        <div className='log-in-page form-container'>
            <h1>
                <p>Welcome to,</p>
                <p className='fw-bolder text-primary'>Bike Booker Admin</p>
            </h1>
            <LogInAndSingUpForm onLogInBtnClick={loginUser} onSignUpBtnClick={async () => { }} showSignUpForm={false} />
        </div>
    );
};

export default LoginPage;