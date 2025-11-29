import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import server from "../enviroment";
export default function RepoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${server}/repo/${id}`)
      .then(res => {
        setRepo(Array.isArray(res.data) ? res.data[0] : res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setMessage("Failed to load repository");
      });
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`${server}/repo/update/${id}`, repo);
      if (res.status === 200) {
        navigate(`/repo/${id}`); // back to RepositoryPage
      } else {
        setMessage("Failed to update repository");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Failed to update repository.");
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!repo) return <div className="text-white p-6">Repository not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Edit Repository</h1>

      {message && <p className="text-red-400 mb-3">{message}</p>}

      <input
        value={repo.name}
        onChange={(e) => setRepo({ ...repo, name: e.target.value })}
        className="w-full p-3 mb-3 bg-gray-800 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Repository Name"
      />

      <textarea
        value={repo.description}
        onChange={(e) => setRepo({ ...repo, description: e.target.value })}
        className="w-full p-3 mb-3 bg-gray-800 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        placeholder="Description"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded transition"
        >
          Save
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
