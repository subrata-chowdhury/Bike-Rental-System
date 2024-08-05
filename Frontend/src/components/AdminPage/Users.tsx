import React from 'react';

interface UserProps {
    name: string;
    email: string;
}

const Users: React.FC = (): JSX.Element => {
    return (
        <div className=''>
            <User name='John Doe' email='example@email.com' />
            <User name='John Doe' email='example@email.com' />
            <User name='John Doe' email='example@email.com' />
            <User name='John Doe' email='example@email.com' />
        </div>
    );
};

const User: React.FC<UserProps> = ({ name, email }): JSX.Element => {
    return (
        <div className='card bg-glass bg-mid-white mb-2'>
            <div className='card-body d-flex flex-row'>
                <div className='flex-grow-1'>
                    <div className='m-0 fs-5' style={{ fontWeight: 500, lineHeight: 1.1 }}>{name}</div>
                    <p className='m-0'>{email}</p>
                </div>
                <div className='d-flex justify-content-center align-items-center cursor-pointer'>
                    <img className='' src='delete.svg'></img>
                </div>
            </div>
        </div>
    );
}

export default Users;