import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';
import './styles/Profile.css';

function Profile({ currentUser, posts }) {
    const { logout } = useAuth0();
    const [accountDeleted, setAccountDeleted] = useState(false);
    const [userPosts, setUserPosts] = useState([]);


    //current user account delete
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



    // Filter the posts to get the current users amount of posts
    useEffect(() => {
        const userPosts = posts.filter(post => post.user_id === currentUser?.user_id);
        setUserPosts(userPosts);
    }, [currentUser, posts]);


    //Logout if account deleted successfully
    useEffect(() => {
        if (accountDeleted) {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    }, [accountDeleted, logout]);



    //if no current user, show loading indicator
    if (!currentUser) {
        return <div>loading...</div>;
    }

    return (
        <div className="profile-container">
            <div class="card">
                <span>{currentUser.username}</span>
                <p class="info"> Email: {currentUser.email} </p>
                <p class="info"> Posts: {userPosts.length} </p>

                <div class="share">
                    <h1 className='m-a' >Manage Account</h1>
                </div>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </div>
    );
}

export default Profile;
