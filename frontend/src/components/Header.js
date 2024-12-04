import React from "react";
import { Link } from "react-router-dom";
import AuthProfile from "./authProfile";

import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
					{/*<li>
            <Link to="/auth">Login</Link>
          </li>*/}
        </ul>
      </nav>
      <h1>Game Realm</h1>
			<AuthProfile />
    </header>
  );
};

export default Header;
