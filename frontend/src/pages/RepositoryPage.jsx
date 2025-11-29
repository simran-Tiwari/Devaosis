


import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import CodeViewer from "../components/CodeViewer";

export default function RepositoryPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(location.state?.currentBranch || "main");
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [loadingRepo, setLoadingRepo] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);

  // Guard: invalid repo ID
  if (!id) {
    return (
      <div className="text-white text-center mt-10 text-xl">
        ❌ Invalid Repository ID
      </div>
    );
  }

  // Fetch repository info
  useEffect(() => {
    const fetchRepo = async () => {
      setLoadingRepo(true);
      try {
        const res = await fetch(`http://localhost:3000/repo/${id}`);
        if (!res.ok) throw new Error("Failed to fetch repository");
        const data = await res.json();
        setRepo(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("Repo fetch error:", err);
      } finally {
        setLoadingRepo(false);
      }
    };
    fetchRepo();
  }, [id]);

  // Fetch branch info
  useEffect(() => {
    if (!id) return; // Prevent undefined fetch

    const fetchBranches = async () => {
      setLoadingBranches(true);
      try {
        const res = await fetch(`http://localhost:3000/repo/branches/${id}`);
        if (!res.ok) throw new Error("Failed to fetch branches");
        const data = await res.json();
        setBranches(data.branches || []);
        setCurrentBranch(data.currentBranch || "main");
      } catch (err) {
        console.error("Branch fetch error:", err);
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, [id]);

  if (loadingRepo || loadingBranches)
    return (
      <div className="text-white text-center mt-10 text-xl">Loading...</div>
    );

  if (!repo)
    return (
      <div className="text-white text-center mt-10 text-xl">
        ❌ Repository not found
      </div>
    );

  const files = repo.content?.filter((f) => f.branch === currentBranch) || [];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* LEFT PANEL: Branches + Files */}
      <div className="w-64 border-r border-gray-700 overflow-y-auto p-4 bg-gray-800">
        <h2 className="text-xl font-bold mb-4">{repo.name}</h2>

        <div className="mb-6">
          <strong>Branches:</strong>
          {branches.length > 0 ? (
            branches.map((b) => (
              <div
                key={b}
                onClick={() => {
                  setCurrentBranch(b);
                  setSelectedFileIndex(null);
                }}
                className={`cursor-pointer rounded px-2 py-1 mt-1 ${
                  b === currentBranch
                    ? "bg-gray-600 border border-gray-500"
                    : "bg-gray-700 border border-gray-600"
                }`}
              >
                {b}
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-2">No branches found.</p>
          )}
        </div>

        <div>
          <strong>Files:</strong>
          {files.length > 0 ? (
            files.map((fileContent, index) => (
              <div
                key={index}
                onClick={() => setSelectedFileIndex(index)}
                className={`cursor-pointer rounded px-2 py-1 mt-1 ${
                  selectedFileIndex === index
                    ? "bg-gray-600 border border-gray-500"
                    : "bg-gray-700 border border-gray-600"
                }`}
              >
                {fileContent.name || `File ${index + 1}`}
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-2">No files in this branch.</p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => navigate(`/repo/${id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded"
          >
            Edit Repo
          </button>

          <button
            onClick={() => navigate(`/repo/${id}/issues`)}
            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded"
          >
            View Issues
          </button>

          <button
            onClick={() => navigate(`/repo/${id}/add-issue`)}
            className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded"
          >
            Add Issue
          </button>

          <button
            onClick={() => navigate(`/repo/${id}/code`)}
            className="bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded"
          >
            View Code
          </button>

          <button
            onClick={() => navigate(`/repo/${id}/tree`)}
            className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded"
          >
            File Tree
          </button>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 bg-gray-800 p-4 rounded overflow-auto">
          {selectedFileIndex !== null ? (
            <CodeViewer content={files[selectedFileIndex]?.content || ""} />
          ) : (
            <p className="text-gray-400">Select a file to view its content</p>
          )}
        </div>
      </div>
    </div>
  );
}
