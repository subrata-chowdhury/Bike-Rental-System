import React, { useState } from 'react';
import { adminRegister, register } from '../../scripts/API Calls/authApiCalls';
import { User } from '../../Types';
import Model from '../Model';

const AddUser: React.FC = () => {
    const [userDetails, setUserDetails] = useState<User>({
        _id: "",
        username: " ",
        email: '',
        password: '',
        role: ""
    });
    const [role, setRole] = useState<string>('customer');

    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        switch (name) {
            case 'firstName':
                setUserDetails({ ...userDetails, username: value.trim() + ' ' + userDetails.username.split(' ')[1] });
                break;
            case 'lastName':
                setUserDetails({ ...userDetails, username: userDetails.username.split(' ')[0] + ' ' + value.trim() });
                break;
            default:
                setUserDetails(prevData => ({
                    ...prevData,
                    [name]: name === "password" ? value : value.trim()
                }));
        }
    }

    async function onSubmitHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (role === 'admin')
            adminRegister(userDetails.username, userDetails.email, userDetails.password, () => {
                alert('Admin Added Successfully');
            });
        else
            register(userDetails.username, userDetails.email, userDetails.password, () => {
                alert('User Added Successfully');
            });
    }

    return (
        <div>
            <button
                className='btn bg-glass bg-deep-white p-3 mt-auto position-fixed end-0 bottom-0 m-4 me-5'
                style={{ lineHeight: 1, zIndex: 15 }}
                data-bs-toggle="modal"
                data-bs-target={"#addUser"}>
                <div className='btn-close' style={{ transform: 'rotate(45deg)' }}></div>
            </button>
            <Model heading="ADD USER" id='addUser'>
                <div className='modal-body form d-flex flex-column px-5'>
                    <label className='mb-2'>
                        <b>Name:</b>
                        <div className='input-group'>
                            <input className='m-0 form-control' name="firstName" value={userDetails.username.split(' ')[0]} onChange={onChangeHandler} placeholder="First Name" />
                            <input className='m-0 form-control' name="lastName" value={userDetails.username.split(' ')[1]} onChange={onChangeHandler} placeholder="Last Name" />
                        </div>
                    </label>
                    <label className='mb-2'>
                        <b>Email:</b> <input className='m-0 form-control' name="email" value={userDetails.email} onChange={onChangeHandler} placeholder="Email" />
                    </label>
                    <label className='mb-2'>
                        <b>Password:</b> <input className='m-0 form-control' name="password" value={userDetails.password} onChange={onChangeHandler} placeholder="Password" />
                    </label>

                    <label className='mb-2'>
                        <b>Role:</b>
                        <input type='checkbox' onChange={() => {
                            if (role === 'customer') setRole('admin');
                            else setRole('customer');
                        }} className='d-none' />
                        <div className='nav nav-pills'>
                            <div className='nav-item'>
                                <div className={'nav-link py-1 ms-2 border border-1 border-secondary cursor-pointer' + (role === 'customer' ? " bg-dark text-white" : " text-dark")}>User</div>
                            </div>
                            <div className='nav-item'>
                                <div className={'nav-link py-1 ms-2 border border-1 border-secondary cursor-pointer' + (role === 'admin' ? ' bg-dark text-white' : " text-dark")}>Admin</div>
                            </div>
                        </div>
                    </label>
                </div>
                <div className="modal-footer mx-auto">
                    <button
                        type="button"
                        className="btn btn-outline-dark border-2 border-dark"
                        data-bs-dismiss="modal"
                    >Close</button>
                    <button type="button" className="btn btn-outline-dark border-2" onClick={() => {
                        setUserDetails({
                            _id: "",
                            username: " ",
                            email: '',
                            password: '',
                            role: ""
                        });
                        setRole('customer')
                    }}>Clear</button>
                    <button type="button" className="btn border-2 btn-dark" onClick={onSubmitHandler} >ADD</button>
                </div>
            </Model>
        </div>
    );
};

export default AddUser;