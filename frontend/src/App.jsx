// import { useContext } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthContext } from "./context/AuthContext.jsx";

// // Auth Pages
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";

// // Home & Repo Pages
// import Home from "./pages/Home";
// import NewRepo from "./pages/NewRepo";
// import RepoDetails from "./pages/RepoDetails";
// import RepoCode from "./pages/RepoCode";
// import FileTreePage from "./pages/FileTreePage";
// import RepoEdit from "./pages/RepoEdit";
// import RepoIssues from "./pages/RepoIssues";
// import AddIssuePage from "./pages/AddIssuePage";
// import IssueDetails from "./pages/IssueDetails";
// import UpdateIssue from "./pages/UpdateIssue";
// import SearchRepo from "./pages/SearchRepo";

// // User Pages
// import UserProfile from "./pages/UserProfile";
// import UpdateProfile from "./pages/UpdateProfile";
// import UpdateBio from "./pages/UpdateBio";
// import DeleteProfile from "./pages/DeleteProfile";
// import AllUsers from "./pages/AllUsers";

// // Components
// import Navbar from "./components/Navbar";

// export default function App() {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) return <div className="text-center py-6">Loading...</div>;

//   // Private Route wrapper
//   const Private = ({ children }) => (user ? children : <Navigate to="/login" />);

//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         {/* Auth */}
//         <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
//         <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />

//         {/* Home */}
//         <Route path="/home" element={<Private><Home /></Private>} />
//         <Route path="/create-repo" element={<Private><NewRepo /></Private>} />
//         <Route path="/search-repo" element={<Private><SearchRepo /></Private>} />
//          <Route path="/repo/:id" element={<RepositoryPage />} />
//         {/* Repository Routes */}
//         <Route path="/repo/:id" element={<Private><RepoDetails /></Private>} />
//         <Route path="/repo/:id/code" element={<Private><RepoCode /></Private>} />
//         <Route path="/repo/:repoId/tree" element={<Private><FileTreePage /></Private>} />
//         <Route path="/repo/:id/edit" element={<Private><RepoEdit /></Private>} />
//         <Route path="/repo/:id/issues" element={<Private><RepoIssues /></Private>} />
//         <Route path="/repo/:id/add-issue" element={<Private><AddIssuePage /></Private>} />

//         {/* Issue Routes */}
//         <Route path="/issue/:id" element={<Private><IssueDetails /></Private>} />
//         <Route path="/issue/update/:id" element={<Private><UpdateIssue /></Private>} />

//         {/* User Routes */}
//         <Route path="/userProfile/:id" element={<Private><UserProfile /></Private>} />
//         <Route path="/updateProfile/:id" element={<Private><UpdateProfile /></Private>} />
//         <Route path="/updateBio/:id" element={<Private><UpdateBio /></Private>} />
//         <Route path="/deleteProfile/:id" element={<Private><DeleteProfile /></Private>} />
//         <Route path="/allUsers" element={<Private><AllUsers /></Private>} />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/home" />} />
//       </Routes>
//     </Router>
//   );
// }


import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";

// Auth Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";

// Home & Repo Pages
import Home from "./pages/Home";
import NewRepo from "./pages/NewRepo";
import RepositoryPage from "./pages/RepositoryPage";
import RepoDetails from "./pages/RepoDetails";
import RepoCode from "./pages/RepoCode";
import FileTreePage from "./pages/FileTreePage";
import RepoEdit from "./pages/RepoEdit";
import RepoIssues from "./pages/RepoIssues";
import AddIssuePage from "./pages/AddIssuePage";
import IssueDetails from "./pages/IssueDetails";
import UpdateIssue from "./pages/UpdateIssue";
import SearchRepo from "./pages/SearchRepo";
import UserRepos from "./pages/UserRepos";

// User Pages
import UserProfile from "./pages/UserProfile";
import UpdateProfile from "./pages/UpdateProfile";
import UpdateBio from "./pages/UpdateBio";
import DeleteProfile from "./pages/DeleteProfile";
import AllUsers from "./pages/AllUsers";

// Components
import Navbar from "./components/Navbar";

export default function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center py-6 text-white">Loading...</div>;

  const Private = ({ children }) => (user ? children : <Navigate to="/login" />);

  return (
    <Router>
      {/* Navbar visible only if logged in */}
      <Navbar />

      <Routes>
        {/* Auth */}
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />

        {/* Home */}
        <Route path="/home" element={<Private><Home /></Private>} />
        <Route path="/create-repo" element={<Private><NewRepo /></Private>} />
        <Route path="/search-repo" element={<Private><SearchRepo /></Private>} />

        {/* Repository Pages (all use :id consistently) */}
        <Route path="/repo/:id" element={<Private><RepositoryPage /></Private>} />
        <Route path="/repo/:id/details" element={<Private><RepoDetails /></Private>} />
        <Route path="/repo/:id/code" element={<Private><RepoCode /></Private>} />
        <Route path="/repo/:id/tree" element={<Private><FileTreePage /></Private>} />
        <Route path="/repo/:id/edit" element={<Private><RepoEdit /></Private>} />
        <Route path="/repo/:id/issues" element={<Private><RepoIssues /></Private>} />
        <Route path="/repo/:id/add-issue" element={<Private><AddIssuePage /></Private>} />

        {/* Issue Pages */}
        <Route path="/issue/:id" element={<Private><IssueDetails /></Private>} />
        <Route path="/issue/update/:id" element={<Private><UpdateIssue /></Private>} />

        {/* User Pages */}
        <Route path="/userProfile/:id" element={<Private><UserProfile /></Private>} />
        <Route path="/updateProfile/:id" element={<Private><UpdateProfile /></Private>} />
        <Route path="/updateBio/:id" element={<Private><UpdateBio /></Private>} />
        <Route path="/deleteProfile/:id" element={<Private><DeleteProfile /></Private>} />
        <Route path="/repo/user/:id" element={<Private><UserRepos /></Private>} />
        <Route path="/allUsers" element={<Private><AllUsers /></Private>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}
