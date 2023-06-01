import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './styles/SideBar.css';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
import { useAuth0 } from "@auth0/auth0-react";


function SideBar({ currentUser, setCurrentUser }) {

    const { user } = useAuth0();



    //LOGGED OUT
    if (!user) {
        return (
            <div className="sidebar">
                <Link to='/'>
                    <div className='logo-container'>
                        <h2 className='logo-title'>Atlas</h2>
                        <img className='logo' src='/mstile-150x150.png'></img>
                    </div>
                </Link>
                <NavLink exact to="/" activeClassName="active">
                    Home
                </NavLink>
                <NavLink to="/about" activeClassName="active">
                    About
                </NavLink>
                <LoginButton setCurrentUser={setCurrentUser} />

            </div>
        );
    }


    //LOGGED IN
    return (
        <div className="sidebar">
            <Link to='/'>
                <div className='logo-container'>
                    <h2 className='logo-title'>Atlas</h2>
                    <img className='logo' src='/mstile-150x150.png'></img>
                </div>
            </Link>
            <NavLink exact to="/" activeClassName="active">
                Home
            </NavLink>
            <NavLink to="/chats" activeClassName="active">
                Atlas
            </NavLink>
            <NavLink to="/about" activeClassName="active">
                About
            </NavLink>
            <NavLink to="/profile" activeClassName="active">
                {currentUser ? currentUser.username : 'Loading...'}
            </NavLink>

            <LogoutButton setCurrentUser={setCurrentUser} />
        </div>
    );
}

export default SideBar;