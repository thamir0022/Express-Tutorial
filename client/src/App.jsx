import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import { UserProvider } from "./context/userContext";
import LoginPage from "../pages/LoginPage";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
