

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Logo from "../assets/github-mark-white.svg"; // Import the logo

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  if (!user) return null; // Hide navbar when not logged in

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      {/* Left Side Navigation */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="w-8 h-8" />
          <span className="font-semibold text-lg">Devaosis</span>
        </Link>

        {/* Home */}
        <Link to="/home" className="hover:text-gray-300 font-semibold">
          Home
        </Link>

        {/* Search Repo */}
        <Link to="/search-repo" className="hover:text-gray-300 font-semibold">
          Search
        </Link>

        {/* All Users */}
        <Link to="/allUsers" className="hover:text-gray-300 font-semibold">
          All Users
        </Link>

        {/* Profile */}
        <Link 
          to={`/userProfile/${user._id}`}
          className="hover:text-gray-300 font-semibold"
        >
          Profile
        </Link>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </nav>
  );
}
