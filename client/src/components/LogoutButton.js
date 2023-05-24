import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/LogoutButton.css";

const LogoutButton = ({ setCurrentUser }) => {
    const { logout } = useAuth0();

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
        setCurrentUser(null); // Set currentUser to null in the parent component
    };

    return (
        <button className="ui-btn" onClick={handleLogout}>
            Log Out
        </button>
    );
};

export default LogoutButton;
