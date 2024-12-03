import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import AuthLogin from "./authLogin";
import AuthLogout from "./authLogout";

import "../styles/Auth0.css";

const AuthProfile = () => {
	const { user, isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return <div>Loading ...</div>;
	}
	if (!isAuthenticated) {
		return (
			<div>
				<p>Not logged in.</p>
				<AuthLogin />
			</div>
		);
	}


	return (
		<div>
			<img src={user.picture} alt={user.name} id="profile-pfp" />
			<div id="info">
				<span>name: {user.name}</span>
				<span>email: {user.email}</span>
				<AuthLogout />
			</div>
		</div>
	);
};

export default AuthProfile;
