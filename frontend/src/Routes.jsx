import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Pages
//import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";

// Auth Context
import { useAuth } from "./context/AuthContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    const tokenFromStorage = localStorage.getItem("token");

    // Set current user if not already set
    if (userFromStorage && !currentUser) {
      setCurrentUser(JSON.parse(userFromStorage));
    }

    // Redirect unauthenticated users
    if (!userFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
      navigate("/auth");
    }

    // Redirect logged-in users away from /auth
    if (userFromStorage && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  const element = useRoutes([
    {
      path: "/",
      element: currentUser ? <Dashboard /> : <Login />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: currentUser ? <Profile /> : <Login />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
