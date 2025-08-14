import React, { useEffect, useState } from 'react';
import UserDetailsModel from './UserDetailsModel';
import { deleteUserByAdmin, getUsersByIndex, updateUserByAdmin } from '../../scripts/API Calls/userApiCalls';
import { User } from '../../Types';
import { adminRegister, register } from '../../scripts/API Calls/authApiCalls';

interface UserProp {

}

const Users: React.FC<UserProp> = (): React.JSX.Element => {
    const [users, setUsers] = React.useState<User[]>([]);
    const [openedUser, setOpenedUser] = useState<number | null>(null);
    const [searchEmailIdData, setSearchEmailIdData] = useState<string>('');

    function downloadUsers(pageNo: number = 1) {
        getUsersByIndex(pageNo, { email: searchEmailIdData }, (data) => {
            setUsers(data.users);
        });
    }

    function updateUser(userDetails: User) {
        updateUserByAdmin(userDetails._id, userDetails.username, userDetails.email, userDetails.password, userDetails.role, () => {
            downloadUsers();
            alert('User Updated Successfully');
        })
    }

    async function onSubmitHandler(userDetails: User) {
        if (userDetails.role === 'admin')
            adminRegister(userDetails.username, userDetails.email, userDetails.password, () => {
                downloadUsers()
            });
        else
            register(userDetails.username, userDetails.email, userDetails.password, () => {
                downloadUsers()
            });
    }

    useEffect(() => {
        downloadUsers()
    }, [])

    return (
        <>
            <div className='input-group mb-3'>
                <input type='text' className='form-control border-dark bg-deep-white' placeholder='Search by Email ID' value={searchEmailIdData} onChange={e => setSearchEmailIdData(e.target.value)} />
                <button className='btn btn-dark' type='button' onClick={() => downloadUsers(1)}>Search</button>
            </div>
            <div className=''>
                {users.map((user, index) => (
                    <UserCard key={user.email} {...user} onDelete={downloadUsers} onClick={() => setOpenedUser(index)} />
                ))}
            </div>
            <button
                className='btn bg-glass bg-deep-white p-3 mt-auto position-fixed end-0 bottom-0 m-4 me-5'
                style={{ lineHeight: 1, zIndex: 15 }}
                onClick={() => setOpenedUser(users.length)}>
                <div className='btn-close' style={{ transform: 'rotate(45deg)' }}></div>
            </button>
            {openedUser !== null && <UserDetailsModel heading={users[openedUser] ? "Edit User" : "Add User"} userData={users[openedUser]} submitBtnLabel={users[openedUser] ? 'SAVE' : 'ADD'} onSubmit={users[openedUser] ? updateUser : onSubmitHandler} onClose={() => setOpenedUser(null)} />}
        </>
    );
};

interface UserCardProp extends User {
    onClick?: () => void
    onDelete?: () => void
}

const UserCard: React.FC<UserCardProp> = ({ _id, username, email, role, onClick = () => { }, onDelete = () => { } }): React.JSX.Element => {
    return (
        <>
            <div className='card bg-white mb-2 cursor-pointer' onClick={onClick}>
                <div className='card-body d-flex flex-row'>
                    <div className='flex-grow-1'>
                        <div className='m-0 fs-6' style={{ fontWeight: 600, lineHeight: 1.1 }}>{username}</div>
                        <span className='m-0'>{email}</span>
                        <span className={'ms-3' + (role === 'admin' ? ' text-danger' : ' text-success')} style={{ fontWeight: 500 }}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
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
                                onDelete()
                            });
                    }}>
                        <img className='' src='delete.svg'></img>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Users;