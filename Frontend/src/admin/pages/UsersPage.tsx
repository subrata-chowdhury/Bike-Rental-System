import React from 'react'
import { useEffect, useState } from 'react';
import UserDetailsModel from '../components/UserDetailsModel.tsx';
import { deleteUserByAdmin, getUsersByIndex, updateUserByAdmin } from '../../scripts/API Calls/userApiCalls.ts';
import { User } from '../../Types.ts';
import { adminRegister, register } from '../../scripts/API Calls/authApiCalls.ts';
import Plus from '../../assets/reactIcons/Plus.tsx';
import { AdminPanel } from '../components/AdminPanel.tsx';
import deleteIcon from '../../assets/delete.svg';

const UsersPage = () => {
    return (
        <div className='d-flex flex-column flex-grow-1 flex-md-row h-100'>
            <AdminPanel />
            <div className='flex-grow-1'>
                <Users />
            </div>
        </div>
    )
}

export default UsersPage;

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
            <div className='d-flex justify-content-between p-2 px-3 align-items-center gap-4 bg-white'>
                <div className='input-group my-auto mr-auto' style={{ maxWidth: '300px' }}>
                    <input
                        type='text'
                        className='form-control border-dark bg-white'
                        placeholder='Search by Email ID'
                        value={searchEmailIdData}
                        onChange={e => setSearchEmailIdData(e.target.value)}
                        style={{ fontSize: '14px' }} />
                    <button className='btn btn-dark' type='button' style={{ fontSize: '14px', fontWeight: 600 }} onClick={() => downloadUsers(1)}>Search</button>
                </div>
                <div className='btn btn-dark d-flex justify-content-center align-items-center px-3 py-2 ps-2' style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }} onClick={() => setOpenedUser(users.length)}>
                    <span className='me-2 ps-1'><Plus size={20} /></span>New User
                </div>
            </div>
            <div className='p-3'>
                {users.map((user, index) => (
                    <UserCard key={user.email} {...user} onDelete={downloadUsers} onClick={() => setOpenedUser(index)} />
                ))}
            </div>
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
                        <img className='' src={deleteIcon}></img>
                    </div>
                </div>
            </div>
        </>
    );
}