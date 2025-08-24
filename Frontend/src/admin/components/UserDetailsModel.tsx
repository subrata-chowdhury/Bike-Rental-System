import React from 'react';
import { User } from '../../Types';
import Model from '../../components/Model';

interface UserDetailsModelProp {
    heading?: string;
    userData?: User;
    onSubmit?: (userDetails: User) => void;
    onClose?: () => void;
    submitBtnLabel?: string;
}

const UserDetailsModel: React.FC<UserDetailsModelProp> = ({ heading = "USER MODEL", userData = { _id: "", username: " ", email: "", password: "", role: "customer" }, onSubmit = () => { }, submitBtnLabel = "SUBMIT", onClose = () => { } }): React.JSX.Element => {
    const [userDetails, setUserDetails] = React.useState<User>({
        _id: userData._id || "",
        username: userData.username || "",
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
        <Model heading={heading} onClose={onClose}>
            <div className='modal-body form d-flex flex-column px-5'>
                <label className='mb-2'>
                    <div style={{ fontWeight: 600 }}>Name:</div>
                    <div className='input-group'>
                        <input className='m-0 form-control' name="firstName" value={userDetails.username.split(' ')[0]} onChange={onChangeHandler} placeholder="First Name" />
                        <input className='m-0 form-control' name="lastName" value={userDetails.username.split(' ')[1]} onChange={onChangeHandler} placeholder="Last Name" />
                    </div>
                </label>
                <label className='mb-2'>
                    <div style={{ fontWeight: 600 }}>Email:</div> <input className='m-0 form-control' name="email" value={userDetails.email} onChange={onChangeHandler} placeholder="Email" />
                </label>
                <label className='mb-2'>
                    <div style={{ fontWeight: 600 }}>Password:</div> <input className='m-0 form-control' name="password" value={userDetails.password} onChange={onChangeHandler} placeholder="Password" />
                </label>
                {userData._id && <label className='mb-2'>
                    <div style={{ fontWeight: 600 }}>User ID:</div> <input className='m-0 form-control' name="_id" disabled readOnly value={userData._id} placeholder="User ID" />
                </label>}

                <label className='mb-2'>
                    <div style={{ fontWeight: 600 }}>Role:</div>
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
                    onClick={onClose}>Close</button>
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

export default UserDetailsModel