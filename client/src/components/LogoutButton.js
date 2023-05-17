import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/LogoutButton.css"

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <button className="ui-btn" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
        </button>
    );
};

export default LogoutButton;