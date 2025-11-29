import { Link } from "react-router-dom";

export default function RepoCard({ repo }) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition duration-200">
      <h3 className="text-lg font-semibold text-gray-900">{repo.name}</h3>
      <p className="text-gray-600 mt-2">{repo.description || "No description"}</p>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/repo/${repo._id}`}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Open
        </Link>
        <Link
          to={`/repo/${repo._id}/edit`}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
