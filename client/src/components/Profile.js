import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';
import './styles/Profile.css';

function Profile({ currentUser }) {
    const { logout } = useAuth0();
    const [accountDeleted, setAccountDeleted] = useState(false);

    const handleDeleteAccount = () => {
        fetch('/current_user', {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setAccountDeleted(true);
                    console.log('Account deleted successfully');
                } else {
                    throw new Error('Failed to delete account');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (accountDeleted) {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    }, [accountDeleted, logout]);

    if (!currentUser) {
        return <div>loading...</div>;
    }

    return (
        <div className="profile-container">
            <div class="card">

                <span>{currentUser.username}</span>
                <p class="info"> Email: {currentUser.email} </p>
                <p class="info"> Posts: 5 </p>

                <div class="share">
                    <h1 className='m-a' >Manage Account</h1>
                </div>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </div>
    );
}

export default Profile;
