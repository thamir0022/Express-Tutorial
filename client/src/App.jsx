import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
