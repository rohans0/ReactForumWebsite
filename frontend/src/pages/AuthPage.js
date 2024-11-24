import React, { useState } from "react";
import "../styles/Authpage.css";

const AuthPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [usernameReqs, setUsernameReqs] = useState({
		longEnough: true,
		onlyLowerAlphanumeric: true
	});
	const [passwordReqs, setPasswordReqs] = useState({
		longEnough: true,
		onlyAlphanumeric: true,
		upperCaseChar: true,
		specialChar: true
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		// Username validation
		const newUsernameReqs = {
			longEnough: /^.{4,}$/.test(username),
			onlyLowerAlphanumeric: /^[a-z0-9]+$/.test(username)
		}
		setUsernameReqs(newUsernameReqs);

		// Password validation
		const newPasswordReqs = {
			longEnough: /^.{6,}$/.test(password),
			onlyAlphanumeric: /^[a-zA-Z0-9!@#$]+$/.test(password),
			upperCaseChar: /[A-Z]/.test(password),
			specialChar: /[!@#$]/.test(password)
		}
		setPasswordReqs(newPasswordReqs);

		if (Object.values(newUsernameReqs).every(v => v === true) &&
				Object.values(newPasswordReqs).every(v => v === true)) {
			alert("created account: " + username + " " + password);
		}
	};

	return (
		<div className="auth-page">
			<h1>Login / Register</h1>
			<form onSubmit={handleSubmit}>
				<p>

					<label htmlFor="username">Username:</label>
					<input type="text"
						id="username"
						name="username"
						onChange={(e) => { setUsername(e.target.value) }}
						required
					/>

					{usernameReqs.longEnough ? null :
						<span className="error">Must be at least six characters.</span>
					}
					{usernameReqs.onlyLowerAlphanumeric ? null :
						<span className="error">Must be only lowercase letters or digits.</span>
					}

				</p>
				<p>
					<label htmlFor="password">Password:</label>
					<input type="text"
						id="password"
						name="password"
						onChange={(e) => { setPassword(e.target.value) }}
						required
					/>

					{passwordReqs.longEnough ? null :
						<span className="error">Must be at least six characters.</span>
					}
					{passwordReqs.onlyAlphanumeric ? null :
						<span className="error">Must be only letters or digits.</span>
					}
					{passwordReqs.upperCaseChar ? null :
						<span className="error">Must contain an uppercase character.</span>
					}
					{passwordReqs.specialChar ? null :
						<span className="error">Must contain one of: ! @ # $</span>
					}

				</p>
				<p>
					<button>Register</button>
				</p>
			</form>
		</div>
	);
};

export default AuthPage;
