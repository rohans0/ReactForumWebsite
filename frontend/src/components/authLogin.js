import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const AuthLogin = () => {
  const { loginWithRedirect } = useAuth0();

  return <button id="login" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default AuthLogin;
