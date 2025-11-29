

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../enviroment";
export default function IssueDetails() {
  const { id } = useParams(); // issue ID
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);

  const fetchIssue = async () => {
    try {
      const res = await axios.get(`${server}/issue/${id}`);
      setIssue(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await axios.delete(`http://localhost:3000/issue/delete/${id}`);
      navigate(-1); // go back
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue");
    }
  };

  if (!issue) return <p>Loading issue...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">{issue.title}</h1>
      <p className="mb-4">{issue.description}</p>
      <p className="mb-4">Status: {issue.status}</p>

      <Link to={`/issue/update/${issue._id}`}>
        <button className="mr-2 px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700">
          Edit
        </button>
      </Link>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
}
