

// src/pages/AddIssuePage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../enviroment";
export default function AddIssuePage() {
  const { id: repoId } = useParams(); 
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setMessage("Title and Description are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${server}/issue/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          repository: repoId, 
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("Issue created successfully!");
        setForm({ title: "", description: "" });

       
        setTimeout(() => navigate(`/repo/${repoId}/issues`), 1000);
      } else {
        setMessage(data.error || "Failed to create issue.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage("Server error. Check console for details.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add New Issue</h1>

      {message && (
        <div className="mb-4 p-3 rounded text-white bg-blue-500">
          {message}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={form.title}
          placeholder="Issue Title"
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="description"
          value={form.description}
          placeholder="Issue Description"
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating..." : "Create Issue"}
        </button>
      </form>
    </div>
  );
}
