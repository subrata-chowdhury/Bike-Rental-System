import React from 'react';
import { adminRegister, register } from '../../scripts/API Calls/authApiCalls';
import { User } from '../../Types';
import Model from '../Model';

interface AddUserProp {
    onAdd?: () => void
}

const AddUser: React.FC<AddUserProp> = ({ onAdd = () => { } }) => {
    async function onSubmitHandler(userDetails: User) {
        if (userDetails.role === 'admin')
            adminRegister(userDetails.username, userDetails.email, userDetails.password, () => {
                onAdd()
                alert('Admin Added Successfully');
            });
        else
            register(userDetails.username, userDetails.email, userDetails.password, () => {
                onAdd()
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
            <UserDetailsModel heading="ADD USER" id="addUser" submitBtnLabel='ADD' onSubmit={onSubmitHandler} />
        </div>
    );
};

interface UserDetailsModelProp {
    heading?: string;
    id: string;
    userData?: User;
    onSubmit?: (userDetails: User) => void;
    submitBtnLabel?: string;
}

export const UserDetailsModel: React.FC<UserDetailsModelProp> = ({ heading = "USER MODEL", id, userData = { _id: "", username: " ", email: "", password: "", role: "customer" }, onSubmit = () => { }, submitBtnLabel = "SUBMIT" }): JSX.Element => {
    const [userDetails, setUserDetails] = React.useState<User>({
        _id: userData._id || "",
        username: userData.username || " ",
        email: userData.email || "",
        password: "",
        role: userData.role || "customer"
    });

    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        switch (name) {
            case 'firstName':
                setUserDetails({ ...userDetails, username: value.trim() + ' ' + userDetails.username.split(' ')[1] });
                break;
            case 'lastName':
                setUserDetails({ ...userDetails, username: userDetails.username.split(' ')[0] + ' ' + value.trim() });
                break;
            case 'role':
                setUserDetails({ ...userDetails, role: userDetails.role === 'admin' ? 'customer' : 'admin' });
                break;
            default:
                setUserDetails(prevData => ({
                    ...prevData,
                    [name]: name === "password" ? value : value.trim()
                }));
        }
    }

    function onSubmitHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        onSubmit({ _id: userData._id, username: userDetails.username, email: userDetails.email, password: userDetails.password, role: userDetails.role });
    }
    return (
        <Model heading={heading} id={id}>
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
                {userData._id && <label className='mb-2'>
                    <b>User ID:</b> <input className='m-0 form-control' name="_id" disabled readOnly value={userData._id} placeholder="User ID" />
                </label>}

                <label className='mb-2'>
                    <b>Role:</b>
                    <input type='checkbox' name='role' onChange={onChangeHandler} className='d-none' />
                    <div className='nav nav-pills'>
                        <div className='nav-item'>
                            <div className={'nav-link py-1 ms-2 border border-1 border-secondary cursor-pointer' + (userDetails.role === 'customer' ? " bg-dark text-white" : " text-dark")}>User</div>
                        </div>
                        <div className='nav-item'>
                            <div className={'nav-link py-1 ms-2 border border-1 border-secondary cursor-pointer' + (userDetails.role === 'admin' ? ' bg-dark text-white' : " text-dark")}>Admin</div>
                        </div>
                    </div>
                </label>
            </div>
            <div className="modal-footer mx-auto">
                <button
                    type="button"
                    className="btn btn-outline-dark border-2 border-dark"
                    data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-outline-dark border-2" onClick={() => {
                    setUserDetails({
                        _id: userData._id,
                        username: " ",
                        email: '',
                        password: '',
                        role: "customer"
                    });
                }}>Clear</button>
                <button type="button" className="btn border-2 btn-dark" onClick={onSubmitHandler} >{submitBtnLabel}</button>
            </div>
        </Model>
    )
}

export default AddUser;