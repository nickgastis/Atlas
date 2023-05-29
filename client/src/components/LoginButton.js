import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/LoginButton.css";

const LoginButton = ({ setCurrentUser }) => {
    const { loginWithRedirect, getAccessTokenSilently } = useAuth0();


    // gets user info from auth
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
                console.log('AUTH USER', userInfo);

                const userData = {
                    username: userInfo.nickname,
                    email: userInfo.email,
                    sub: userInfo.sub,
                };


                //posts user to my database
                fetch("/auth/callback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("User Status:", data);
                        // Fetch current user after callback and update current user state
                        fetchCurrentUser();
                    })
                    .catch((error) => {
                        console.error("Error adding user to the database:", error);
                    });
            } else {
                throw new Error("Failed to fetch user information");
            }
        };

        // grabs current user
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch("/current_user");
                if (response.ok) {
                    const currentUser = await response.json();
                    setCurrentUser(currentUser); // Update current user state
                } else {
                    throw new Error("Failed to fetch current user");
                }
            } catch (error) {
                console.error("Error retrieving current user:", error);
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
    }, [getAccessTokenSilently, setCurrentUser]);






    return (
        <button className="ui-btn" onClick={loginWithRedirect}>
            Log In
        </button>
    );
};

export default LoginButton;
