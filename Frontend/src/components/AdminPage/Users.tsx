import React, { useEffect } from 'react';
import AddUser from './AddUser';
import { deleteUserByAdmin, getAllUsers, updateUserByAdmin } from '../../scripts/API Calls/userApiCalls';
import { User } from '../../Types';
import Model from '../Model';

interface UserProp {
    logout: () => void;
}

const Users: React.FC<UserProp> = ({ logout }): JSX.Element => {
    const [users, setUsers] = React.useState<User[]>([]);
    useEffect(() => {
        getAllUsers((data) => {
            setUsers(data);
        }, logout);
    }, [])
    return (
        <>
            <div className=''>
                {users.map((user) => (
                    <UserCard key={user.email} {...user} />
                ))}
            </div>
            <AddUser />
        </>
    );
};

const UserCard: React.FC<User> = ({ _id, username, email, role }): JSX.Element => {
    const [userDetails, setUserDetails] = React.useState<User>({
        _id: "",
        username: username,
        email: email,
        password: '',
        role: ""
    });
    const [userRole, setRole] = React.useState<string>(role);

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

    function onSubmitHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        updateUserByAdmin(_id, userDetails.username, userDetails.email, userDetails.password, userRole, () => {
            alert('User Updated Successfully');
        })
    }

    return (
        <>
            <div className='card bg-glass bg-mid-white mb-2 cursor-pointer'
                data-bs-toggle="modal"
                data-bs-target={"#editUser" + email}>
                <div className='card-body d-flex flex-row'>
                    <div className='flex-grow-1'>
                        <div className='m-0 fs-5' style={{ fontWeight: 500, lineHeight: 1.1 }}>{username}</div>
                        <span className='m-0'>{email}</span>
                        <span className={'ms-3' + (role === 'admin' ? ' text-danger' : ' text-success')}>{role}</span>
                    </div>
                    <div className='d-flex justify-content-center align-items-center cursor-pointer me-2' onClick={(e) => {
                        e.stopPropagation()
                        if (window.confirm('Are you sure you want to delete this user?'))
                            if (role !== 'customer') {
                                if (window.confirm('It is not recommended to delete a admin user, are you sure?'))
                                    deleteUserByAdmin(_id, () => {
                                        alert('User deleted Successfully');
                                    });
                            }
                            else deleteUserByAdmin(_id, () => {
                                alert('User deleted Successfully');
                            });
                    }}>
                        <img className='' src='delete.svg'></img>
                    </div>
                </div>
            </div>

            <Model heading="Edit User" id={"editUser" + email}>
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
                            if (userRole === 'customer') setRole('admin');
                            else setRole('customer');
                        }} className='d-none' />
                        <div className='nav nav-pills'>
                            <div className='nav-item'>
                                <div className={'nav-link py-1 ms-2 border border-1 border-secondary cursor-pointer' + (userRole === 'customer' ? " bg-dark text-white" : " text-dark")}>User</div>
                            </div>
                            <div className='nav-item'>
                                <div className={'nav-link py-1 ms-2 border border-1 border-secondary cursor-pointer' + (userRole === 'admin' ? ' bg-dark text-white' : " text-dark")}>Admin</div>
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
                            _id: "",
                            username: " ",
                            email: '',
                            password: '',
                            role: ""
                        });
                        setRole('customer');
                    }}>Clear</button>
                    <button type="button" className="btn border-2 btn-dark" onClick={onSubmitHandler} >SAVE</button>
                </div>
            </Model>
        </>
    );
}

export default Users;