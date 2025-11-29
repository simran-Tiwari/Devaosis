
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";
import server from "../enviroment.js";
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRepos = async () => {
    if (!user?._id && !user?.id) {
      setRepos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userId = user._id || user.id;
      const res = await axios.get(`${server}/user/${userId}`);
      const data = res.data;

      
      const list = Array.isArray(data) ? data : data?.repositories ?? [];
      setRepos(list);
    } catch (err) {
      console.error("Error fetching repos:", err);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (user) fetchRepos();
  }, [user]);

  
  useEffect(() => {
    if (location.state?.newRepo) {
      setRepos((prev) => {
        
        const exists = prev.find((r) => r._id === location.state.newRepo._id);
        if (exists) return prev;
        return [location.state.newRepo, ...prev];
      });
    }
    
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 text-white">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Welcome, {user?.username}!
      </h1>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mb-10">
        <button
          onClick={() => navigate("/create-repo")}
          className="bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl font-semibold shadow-lg"
        >
          Create New Repository
        </button>

        <button
          onClick={() => navigate("/search-repo")}
          className="bg-indigo-600 hover:bg-indigo-700 transition py-4 rounded-xl font-semibold shadow-lg"
        >
          Search Repository
        </button>

        <button
          onClick={() => navigate(`/userProfile/${user?._id || user?.id}`)}
          className="bg-green-600 hover:bg-green-700 transition py-4 rounded-xl font-semibold shadow-lg"
        >
          View Profile
        </button>

        <button
          onClick={() => navigate("/allUsers")}
          className="bg-purple-600 hover:bg-purple-700 transition py-4 rounded-xl font-semibold shadow-lg"
        >
          All Users
        </button>
      </div>

      {/* Existing Repositories */}
      <h2 className="text-2xl font-bold mb-6">My Repositories</h2>

      {loading ? (
        <p className="text-gray-400">Loading repositories...</p>
      ) : repos.length === 0 ? (
        <p className="text-gray-400">You have no repositories yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {repos.map((repo) => (
            <div
              key={repo._id}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
                <p className="text-gray-300 mb-4">
                  {repo.description || "No description"}
                </p>
              </div>
              <button
                onClick={() => navigate(`/repo/${repo._id}`)}
                className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded-lg transition"
              >
                View Repository
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
