import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

// Utility function to handle the login API call
const loginUser = async (userInput) => {
  const res = await fetch("/api/auth/user/sign-in", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(userInput),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

const LoginPage = () => {
  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ message: "", success: null });
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInput((prevInput) => ({
      ...prevInput,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", success: null });

    // Basic client-side validation
    if (!userInput.email || !userInput.password) {
      setStatus({ message: "Please enter both email and password.", success: false });
      return;
    }

    try {
      const data = await loginUser(userInput);
      setStatus({ message: "Sign In Successful", success: true });
      login(data);
      navigate("/");
    } catch (error) {
      setStatus({ message: error.message, success: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={userInput.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={userInput.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
      {status.message && (
        <p className={status.success ? "text-green" : "text-red"}>
          {status.message}
        </p>
      )}
    </form>
  );
};

export default LoginPage;
