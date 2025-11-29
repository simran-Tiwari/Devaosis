import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", bio: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/userProfile/${id}`);
        const data = await res.json();
        setForm({ email: data.email, password: "", bio: data.bio || "" });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3000/updateProfile/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      navigate(`/userProfile/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Update Profile</h2>

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="New Password"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
        />

        <textarea
          name="bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Your bio..."
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none resize-none"
        />

        <button type="submit" className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition">
          Save
        </button>
      </form>
    </div>
  );
}
