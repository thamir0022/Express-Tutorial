import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(`/api/user/update/${user._id}`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!data.success) {
        setErrorMessage(data?.message);
      } else {
        alert("User updated successfully!");
        navigate("/"); // redirect to home or another page
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("An error occurred while updating the user.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Update User</h2>
        {errorMessage && (
          <div className="bg-red-100 text-red-500 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
          <small className="text-gray-500">
            Password must be 6-12 characters, no spaces.
          </small>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
