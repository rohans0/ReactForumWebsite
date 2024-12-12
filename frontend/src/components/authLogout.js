import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

// button that logs out of auth0 and refreshes
const AuthLogout = () => {
  const { logout } = useAuth0();

  return (
    <button id="logout" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </button>
  );
};

export default AuthLogout;
