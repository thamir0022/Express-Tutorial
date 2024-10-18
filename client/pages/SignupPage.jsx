import React, { useState } from "react";
import { useUser } from "../src/context/userContext";

const SignupPage = () => {
  const [userInput, setUserInput] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const { user, login, logout } = useUser();
  console.log('User',user);

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/user/sign-up", {
        headers: {
          "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userInput),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSuccess(false);
        setMessage(data.message);
      } else if (res.ok && data.success) {
        setSuccess(true);
        setMessage("Sign Up Successful");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="firstName"
        placeholder="First Name"
        onChange={handleChange}
      />
      <input
        type="text"
        id="lastName"
        placeholder="Last Name"
        onChange={handleChange}
      />
      <input
        type="email"
        id="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="password"
        id="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Login</button>
      {message && (
        <p className={`${success ? "text-green" : "text-red"}`}>{message}</p>
      )}
    </form>
  );
};

export default SignupPage;
