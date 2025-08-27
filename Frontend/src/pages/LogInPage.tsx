import React, { useEffect, useRef, useState } from 'react';
import { login, register } from '../scripts/API Calls/authApiCalls.ts';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../scripts/API Calls/userApiCalls.ts';
import eyeIcon from '../assets/eye.svg';
import eyeClosedIcon from '../assets/eye-closed.svg';

const LogInPage: React.FC = (): React.JSX.Element => {
    const navigate = useNavigate()

    // Check if user is already logged in
    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    async function checkUserLoggedIn() {
        const res = await getUser();
        if (res === null) {
            localStorage.removeItem('token');
        } else {
            navigate('/')
        }
    }

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
        login(email.trim(), password, () => {
            navigate('/')
        });
    }

    async function registerUser(formData: { email: string, password: string, firstName: string, lastName: string }) {
        const { email, password, firstName, lastName } = formData;
        if (firstName === '' || lastName === '' || email === '' || password === '') {
            alert("Please fill all the fields");
            return;
        }
        await register(firstName.trim() + ' ' + lastName.trim(), email.trim(), password, () => { });
    }

    return (
        <>
            <div className='log-in-page form-container my-auto'>
                <h1>
                    <p>Welcome to,</p>
                    <p className='fw-bolder text-primary'>Bike Rental</p>
                </h1>
                <LogInAndSingUpForm onLogInBtnClick={loginUser} onSignUpBtnClick={registerUser} />
            </div>
        </>
    );
}

type LogInAndSingUpFormProp = {
    onLogInBtnClick: (formData: { email: string, password: string }) => void,
    onSignUpBtnClick: (formData: { email: string, password: string, firstName: string, lastName: string }) => Promise<void>,
    showSignUpForm?: boolean
}

export const LogInAndSingUpForm: React.FC<LogInAndSingUpFormProp> = ({ onLogInBtnClick, onSignUpBtnClick, showSignUpForm = true }) => {
    const [isSignInState, setIsSignInState] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const loginBtn = useRef<HTMLButtonElement>(null)

    function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        switch (e.currentTarget.name) {
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    return (
        <div className='card p-4 pt-0 bg-white'>
            {/* log in form */}
            <form className='form card-body d-flex flex-column' style={{ gap: (!isSignInState ? '0.5rem' : '0.5rem') }}>
                <ul className="nav justify-content-lg-start justify-content-center flex-0 mb-2" style={{ fontWeight: 600 }} >
                    <li className="">
                        <div className={"nav-link cursor-pointer" + (isSignInState ? ' text-grey text-secondary' : " active text-primary border-2 border-bottom border-primary")} style={{ fontSize: '1.25rem' }} onClick={() => setIsSignInState(false)}>Sign In</div>
                    </li>
                    {showSignUpForm && <li className="">
                        <div className={"nav-link cursor-pointer" + (!isSignInState ? ' text-grey text-secondary' : " active text-primary border-2 border-bottom border-primary")} style={{ fontSize: '1.25rem' }} onClick={() => setIsSignInState(true)}>Join In</div>
                    </li>}
                </ul>

                {!isSignInState && <>
                    <div>
                        <label className='form-label w-100'>
                            Email:
                            <input
                                type="text"
                                name="email"
                                value={email}
                                placeholder='Enter Email'
                                onChange={inputHandler}
                                className='form-control bg-deep-white'
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label className='form-label w-100'>
                            Password:
                            <div className='input-group'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password" value={password}
                                    placeholder='Enter Password'
                                    onChange={inputHandler}
                                    className='form-control border-end-0 rounded-start bg-deep-white'
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.keyCode === 13) {
                                            e.preventDefault()
                                            if (loginBtn.current)
                                                loginBtn.current.click()
                                        }
                                    }}
                                    required
                                />
                                <button className='btn border border-start-0 bg-deep-white' onClick={e => {
                                    e.preventDefault()
                                    setShowPassword(val => !val)
                                }}>
                                    <img src={showPassword ? eyeClosedIcon : eyeIcon}></img>
                                </button>
                            </div>
                        </label>
                    </div>
                    <button className='btn btn-primary' type="submit" ref={loginBtn} onClick={e => {
                        e.preventDefault()
                        onLogInBtnClick({ email, password })
                    }}>Log In</button>
                    <div>
                        Don't have an account?
                        <span className='text-primary cursor-pointer' onClick={() => setIsSignInState(true)}>
                            {' '}Create a new account
                        </span>
                    </div>
                </>}

                {/* sign up form */}
                {showSignUpForm && isSignInState && <SignUpForm setIsSignInState={setIsSignInState} onSignUpBtnClick={onSignUpBtnClick} />}
            </form>
        </div>
    )
}

type SignUpFormProp = {
    setIsSignInState: (val: boolean) => void,
    onSignUpBtnClick: (formData: { email: string, password: string, firstName: string, lastName: string }) => Promise<void>
}

const SignUpForm: React.FC<SignUpFormProp> = ({ setIsSignInState, onSignUpBtnClick }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const [showPassword, setShowPassword] = useState<boolean>(false);

    function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
        switch (e.currentTarget.name) {
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'confirmPassword':
                setConfirmPassword(e.target.value);
                break;
            case 'firstName':
                setFirstName(e.target.value);
                break;
            case 'lastName':
                setLastName(e.target.value);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div>
                <label className='form-label w-100'>
                    Email:
                    <input
                        type="text"
                        name="email"
                        value={email}
                        placeholder='Enter Email'
                        onChange={inputHandler}
                        className='form-control'
                        required
                    />
                </label>
            </div>
            <div>
                <label className='form-label w-100'>
                    Password:
                    <div className='input-group'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            placeholder='Enter Password'
                            onChange={inputHandler}
                            className='form-control border-end-0 rounded-start'
                            required
                        />
                        <button className='btn bg-deep-white border border-start-0' onClick={e => {
                            e.preventDefault()
                            setShowPassword(val => !val)
                        }}>
                            <img src={showPassword ? eyeClosedIcon : eyeIcon}></img>
                        </button>
                    </div>
                </label>
            </div>
            <div>
                <label className='form-label w-100'>
                    Confirm Password:
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        placeholder='Re-enter the Password'
                        onChange={inputHandler}
                        className='form-control'
                        required
                    />
                </label>
            </div>
            <div>
                <label className='form-label w-100'>
                    Name:
                    <div className='input-group'>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={inputHandler}
                            placeholder='First Name'
                            className='form-control'
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={inputHandler}
                            placeholder='Last Name'
                            className='form-control'
                            required
                        />
                    </div>
                </label>
            </div>
            <button type="submit" className='btn btn-primary' onClick={async e => {
                e.preventDefault()
                await onSignUpBtnClick({ email, password, firstName, lastName })
                setIsSignInState(false)
            }} >Sign Up</button>
            <div>Already have an account? <div className='text-primary cursor-pointer' onClick={() => {
                setIsSignInState(false)
            }}>Log in</div></div>
        </>
    )
}

export default LogInPage;