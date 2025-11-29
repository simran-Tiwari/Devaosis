import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../enviroment";
export default function UpdateIssue() {
  const { id } = useParams(); // issue ID
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [repoId, setRepoId] = useState(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await axios.get(`${server}//issue/${id}`);
        const issue = res.data;
        setTitle(issue.title);
        setDescription(issue.description);
        setStatus(issue.status);
        setRepoId(issue.repoId); // store repoId for redirect
      } catch (err) {
        console.error(err);
        alert("Failed to load issue.");
      }
    };
    fetchIssue();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and description cannot be empty.");
      return;
    }

    try {
      await axios.put(`${server}/issue/update/${id}`, { title, description, status });
      // Redirect to repository's issues list
      if (repoId) navigate(`/repo/${repoId}/issues`);
      else navigate(-1); // fallback
    } catch (err) {
      console.error(err);
      alert("Failed to update issue");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Update Issue</h1>

      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600 w-full h-32"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600 w-full"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
      >
        Update Issue
      </button>
    </div>
  );
}
