import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../enviroment";
export default function UpdateBio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${server}/userProfile/${id}`);
      const data = await res.json();
      setBio(data.bio || "");
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${server}/updateBio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      navigate(`/userProfile/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update bio");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Update Bio</h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write your bio..."
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none h-32"
        />
        <button type="submit" className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition">
          Save
        </button>
      </form>
    </div>
  );
}
