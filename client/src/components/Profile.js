import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';
import Post from './Post';
import './styles/Profile.css';

function Profile({ currentUser, posts, setPosts }) {
    const { logout } = useAuth0();
    const [accountDeleted, setAccountDeleted] = useState(false);
    const [userPosts, setUserPosts] = useState([]);

    // Current user account delete
    const handleDeleteAccount = () => {
        fetch('/current_user', {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setAccountDeleted(true);
                    console.log('Account deleted successfully');
                } else {
                    throw new Error('Failed to delete account');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Filter the posts to get the current user's posts
    useEffect(() => {
        const filteredPosts = posts.filter((post) => post.user_id === currentUser?.user_id);
        setUserPosts(filteredPosts);
    }, [currentUser, posts]);

    // Logout if account deleted successfully
    useEffect(() => {
        if (accountDeleted) {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    }, [accountDeleted, logout]);

    // If no current user, show loading indicator
    if (!currentUser) {
        return <div>loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="card">
                <span>{currentUser.username}</span>
                <p className="info"> Email: {currentUser.email} </p>
                <p className="info"> Posts: {userPosts.length} </p>

                <div className="share">
                    <h1 className="m-a">Manage Account</h1>
                </div>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
            <h1 className='font-link-p'>Your Posts</h1>
            <div className="post-list-p">
                {userPosts.map((post) => (
                    <Post key={post.id} post={post} setPosts={setPosts} currentUser={currentUser} />
                ))}
            </div>
        </div>
    );
}

export default Profile;

