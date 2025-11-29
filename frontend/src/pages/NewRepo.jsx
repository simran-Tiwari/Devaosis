
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function NewRepo() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [message, setMessage] = useState("");

  const createRepo = async () => {
    setMessage("");

    const userId = user?._id || user?.id;
    if (!name.trim()) return setMessage("Repository name is required");
    if (!userId) return setMessage("You must be logged in");

    const payload = {
      name: name.trim(),
      description: desc.trim(),
      visibility,
      owner: userId,
    };

    try {
      const res = await fetch("http://localhost:3000/repo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("SERVER RESPONSE:", data);

      if (!res.ok || !data?._id) {
        setMessage(data?.error || "Failed to create repository");
        return;
      }

      // Use the server-returned fields (trust server)
      const createdRepo = {
        _id: data._id,
        name: data.name ?? payload.name,
        description: data.description ?? payload.description,
        visibility: data.visibility ?? (payload.visibility ? "public" : "private"),
        owner: data.owner ?? payload.owner,
        branches: data.branches ?? ["main"],
        currentBranch: data.currentBranch ?? "main",
        content: data.content ?? []
      };

      // First update Home (so it shows instantly)
      navigate("/home", { state: { newRepo: createdRepo } });

      // Then go to the repository page
      setTimeout(() => navigate(`/repo/${createdRepo._id}`), 120);
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create New Repository
        </h2>

        {message && <p className="mb-4 text-center text-red-500">{message}</p>}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Repository name"
          className="w-full p-3 rounded mb-4 border border-gray-300"
        />

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          className="w-full p-3 rounded mb-4 border border-gray-300 h-24"
        />

        <select
          value={visibility ? "public" : "private"}
          onChange={(e) => setVisibility(e.target.value === "public")}
          className="w-full p-3 rounded mb-6 border border-gray-300"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <button
          onClick={createRepo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
        >
          Create Repository
        </button>
      </div>
    </div>
  );
}
