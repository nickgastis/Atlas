import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './styles/SideBar.css';

function SideBar() {
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
                Chats
            </NavLink>
            <NavLink to="/logout" activeClassName="active">
                Logout
            </NavLink>
        </div>
    );
}

export default SideBar;