import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import AuthLogin from "./authLogin";
import AuthLogout from "./authLogout";

import "../styles/Auth0.css";

// user profile, where login/ logout buttons are located
const AuthProfile = () => {
	const { user, isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return <div>Loading ...</div>;
	}

	return (
		<div id="info">
			{!isAuthenticated ?
				<>
					<p>Not logged in.</p>
					<AuthLogin />
				</>
				:
				<>
					<img src={user.picture} alt={user.name} id="profile-pfp" />
					<div>
						<p id="welcome">Welcome {user.name}!</p>
						<AuthLogout />
					</div>
				</>
			}
		</div>
	);
};

export default AuthProfile;
