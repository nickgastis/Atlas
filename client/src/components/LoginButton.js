import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/LoginButton.css";

const LoginButton = () => {
    const { loginWithRedirect, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const getUserInfo = async (accessToken) => {
            const url = "https://dev-fxjbmegke1ksv11l.us.auth0.com/userinfo";

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const userInfo = await response.json();
                console.log(userInfo);

                // Send POST request to backend API to add the user to the database
                const userData = {
                    username: userInfo.nickname,
                    email: userInfo.email,
                    sub: userInfo.sub,
                };


                fetch("/auth/callback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("User added successfully:", data);

                    })
                    .catch((error) => {
                        console.error("Error adding user to the database:", error);
                    });
            } else {
                throw new Error("Failed to fetch user information");
            }
        };

        const fetchUserInfo = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                await getUserInfo(accessToken);
            } catch (error) {
                console.error("Error retrieving user information:", error);
            }
        };

        fetchUserInfo();
    }, [getAccessTokenSilently]);

    return (
        <button className="ui-btn" onClick={loginWithRedirect}>
            Log In
        </button>
    );
};

export default LoginButton;
