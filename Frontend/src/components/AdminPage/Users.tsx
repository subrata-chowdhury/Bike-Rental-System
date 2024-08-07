import React, { useEffect } from 'react';
import AddUser, { UserDetailsModel } from './AddUser';
import { deleteUserByAdmin, getAllUsers, updateUserByAdmin } from '../../scripts/API Calls/userApiCalls';
import { User } from '../../Types';

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

    function updateUser(userDetails: User) {
        updateUserByAdmin(userDetails._id, userDetails.username, userDetails.email, userDetails.password, userDetails.role, () => {
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
            <UserDetailsModel heading="Edit User" id={"editUser" + email} userData={{ _id, username, password: "", email, role }} submitBtnLabel='SAVE' onSubmit={updateUser} />
        </>
    );
}

export default Users;