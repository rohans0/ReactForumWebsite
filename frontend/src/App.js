import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import { Post } from "./pages/Post.js";
import { UnknownPage } from "./pages/UnknownPage.js";
import "./styles/globals.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          {/* Routes for the application */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="*" element={<UnknownPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
