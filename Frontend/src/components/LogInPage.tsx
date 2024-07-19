import React, { useEffect, useRef, useState } from 'react';
import { login, register } from '../scripts/API Calls/authApiCalls';
import { verifyFieldsForLogIn, verifyFieldsForRegister } from '../scripts/InputsVerifires';
import { useNavigate } from 'react-router-dom';

const LogInPage: React.FC = (): JSX.Element => {
    const [isSignInState, setIsSignInState] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const loginBtn = useRef<HTMLButtonElement>(null)

    const navigate = useNavigate()

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

    // Check if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/Home')
        }
    }, [])


    // form submit handler
    async function loginUser(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if (email && password)
            verifyFieldsForLogIn(email, password) ?
                login(email.trim(), password, () => {
                    navigate('/Home')
                }) : ""
    }

    return (
        <>
            <div className='log-in-page form-container'>
                <h1>
                    <p>Welcome to,</p>
                    <p className='fw-bolder text-primary'>Bike Booker</p>
                </h1>
                <div className='card p-4 bg-glass bg-light-white'>
                    {/* log in form */}
                    <form className='form card-body d-flex flex-column' style={{ gap: (!isSignInState ? '1rem' : '0.5rem') }}>
                        {!isSignInState && <>
                            <div>
                                <label className='form-label'>
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
                                <label className='form-label'>
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
                                            <img src={showPassword ? 'eye-closed.svg' : 'eye.svg'}></img>
                                        </button>
                                    </div>
                                </label>
                            </div>
                            <button className='btn btn-primary' type="submit" ref={loginBtn} onClick={loginUser}>Log In</button>
                            <div>
                                Don't have an account?
                                <span className='text-primary cursor-pointer' onClick={() => setIsSignInState(true)}>
                                    {' '}Create a new account
                                </span>
                            </div>
                        </>}

                        {/* sign up form */}
                        {isSignInState && <SignUpForm setIsSignInState={setIsSignInState} />}
                    </form>
                </div>
            </div>
        </>
    );
}

type SignUpFormProp = {
    setIsSignInState: (val: boolean) => void
}

const SignUpForm: React.FC<SignUpFormProp> = ({ setIsSignInState }) => {
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

    // form submit handler
    async function registerUser(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if (verifyFieldsForRegister(email, password, confirmPassword, firstName, lastName)) {
            await register(firstName.trim() + ' ' + lastName.trim(), email.trim(), password, () => {
                setIsSignInState(false)
            });
        }
    }
    return (
        <>
            <div>
                <label className='form-label'>
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
                <label className='form-label'>
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
                            <img src={showPassword ? 'eye-closed.svg' : 'eye.svg'}></img>
                        </button>
                    </div>
                </label>
            </div>
            <div>
                <label className='form-label'>
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
                <label className='form-label '>
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
            <button type="submit" className='btn btn-primary' onClick={registerUser} >Sign Up</button>
            <div>Already have an account? <div className='text-primary cursor-pointer' onClick={() => {
                setIsSignInState(false)
            }}>Log in</div></div>
        </>
    )
}

export default LogInPage;