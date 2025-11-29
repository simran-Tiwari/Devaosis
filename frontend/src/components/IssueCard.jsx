import { Link } from "react-router-dom";
import axios from "axios";

export default function IssueCard({ issue, repoId, refresh }) {
  const handleDelete = async () => {
    if (!window.confirm("Delete this issue?")) return;
    try {
      await axios.delete(`http://localhost:3000/issue/delete/${issue._id}`);
      refresh(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow hover:shadow-lg flex justify-between items-center">
      <div>
        <Link to={`/issue/${issue._id}`}>
          <h3 className="text-lg font-semibold">{issue.title}</h3>
        </Link>
        <p className="text-gray-300">{issue.description}</p>
        <p className="text-gray-400">Status: {issue.status}</p>
      </div>
      <div className="space-x-2">
        <Link to={`/issue/update/${issue._id}`}>
          <button className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600">
            Edit
          </button>
        </Link>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
