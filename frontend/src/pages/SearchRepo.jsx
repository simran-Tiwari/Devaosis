import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RepoCard from "../components/RepoCard";
import server from "../enviroment";
export default function SearchRepo() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // new
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`${server}/repo/name/${query}`);

      if (!res.ok) {
        if (res.status === 404) {
          setResults([]);
          return;
        }
        throw new Error("Failed to fetch repositories");
      }

      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setError("Error fetching repositories. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Search Repository</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter repository name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-300">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && results.length === 0 && !error && (
        <p className="text-gray-400">No repositories found.</p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((repo) => (
            <div
              key={repo._id}
              onClick={() => navigate(`/repo/${repo._id}`)}
              className="cursor-pointer"
            >
              <RepoCard repo={repo} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
