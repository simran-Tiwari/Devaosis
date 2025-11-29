

// src/pages/RepoCode.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import FileTreeContainer from "../components/FileTreeContainer";
import axios from "axios";
import server from "../enviroment";
export default function RepoCode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { filePath } = location.state || {};

  const [repo, setRepo] = useState(null);

  // Fetch repository details
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await axios.get(`${server}/repo/${id}`);
        setRepo(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRepo();
  }, [id]);

  if (!repo) return <p className="text-white p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/repo/${id}`)}
        className="mb-4 px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
      >
        ← Back
      </button>

      {/* FileTree + CodeViewer */}
      <FileTreeContainer repoId={id} initialFile={filePath} />
    </div>
  );
}
