import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";

const Header = () => {
  const { user } = useUser();

  return (
    <header className="w-screen flex h-14 bg-black/25 items-center px-4 justify-between">
      <Link to={"/"} className="text-2xl font-semibold">
        Amazon
      </Link>
      <nav className="md:w-1/4 flex justify-around">
        <Link to={"/"}>Home</Link>
        <Link to={"/"}>All Products</Link>
        <Link to={"/"}>Cart</Link>
      </nav>
      <div className="flex justify-between">
        {user ? (
          <span className="size-10 rounded-full flex items-center justify-center bg-blue-600 text-xl text-white font-semibold ">
            {user && user.firstName[0]}
          </span>
        ) : (
          <Link to={'/sign-in'} className="hidden md:block">Sign In</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
