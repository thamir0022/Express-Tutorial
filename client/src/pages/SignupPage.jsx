import React, { useState } from "react";
import { useUser } from "../context/userContext"; 
import { useNavigate } from "react-router-dom";

// Utility function for signing up a user
const signupUser = async (userInput) => {
  const res = await fetch("/api/auth/user/sign-up", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(userInput),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Sign Up failed");
  }
  return data;
};

const SignupPage = () => {
  const [userInput, setUserInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ message: "", success: null });
  const { login } = useUser(); 
  const navigate = useNavigate();

  // Handling input changes efficiently
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserInput((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", success: null });

    // Basic validation check
    if (!userInput.email || !userInput.password || !userInput.firstName || !userInput.lastName) {
      setStatus({ message: "Please fill all fields", success: false });
      return;
    }

    try {
      const data = await signupUser(userInput);
      setStatus({ message: "Sign Up Successful", success: true });
      login(data);  
      navigate("/");
    } catch (error) {
      setStatus({ message: error.message, success: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="firstName"
        placeholder="First Name"
        value={userInput.firstName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        id="lastName"
        placeholder="Last Name"
        value={userInput.lastName}
        onChange={handleChange}
        required
      />
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
      <button type="submit">Sign Up</button>
      {status.message && (
        <p className={status.success ? "text-green" : "text-red"}>
          {status.message}
        </p>
      )}
    </form>
  );
};

export default SignupPage;
