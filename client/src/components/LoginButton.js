import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/LoginButton.css"

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className="ui-btn" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;