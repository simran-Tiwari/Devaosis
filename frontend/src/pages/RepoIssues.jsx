import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import IssueCard from "../components/IssueCard";

export default function RepoIssues() {
  const { id } = useParams(); // repo ID
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/issue/all`, {
        params: { id },
      });
      setIssues(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [id]);

  if (loading) return <p className="text-white text-center py-6">Loading issues...</p>;
  if (error) return <p className="text-red-400 text-center py-6">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Issues</h1>
        <button
          onClick={() => navigate(`/repo/${id}/add-issue`)}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Add New Issue
        </button>
      </div>

      {issues.length > 0 ? (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue._id}
              onClick={() => navigate(`/issue/${issue._id}`)}
              className="cursor-pointer bg-gray-800 p-4 rounded hover:bg-gray-700 transition"
            >
              <h2 className="font-semibold text-lg">{issue.title}</h2>
              <p className="text-gray-300 text-sm">
                Status: <span className="capitalize">{issue.status}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300">No issues found for this repository.</p>
      )}
    </div>
  );
}
