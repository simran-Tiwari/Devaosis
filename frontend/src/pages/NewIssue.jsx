
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewIssue() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "", repository: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim() || !form.description.trim() || !form.repository.trim()) {
      setMessage("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/issue/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("Issue created successfully!");
        setForm({ title: "", description: "", repository: "" });
        setTimeout(() => navigate("/issues"), 1000);
      } else {
        setMessage(data.error || "Failed to create issue");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-xl shadow-lg mt-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>

      {message && (
        <div className="mb-4 p-2 bg-green-700 rounded text-white">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="repository"
          value={form.repository}
          placeholder="Repository ID"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="title"
          value={form.title}
          placeholder="Issue Title"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          value={form.description}
          placeholder="Issue Description"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition font-semibold ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Issue"}
        </button>
      </form>
    </div>
  );
}
