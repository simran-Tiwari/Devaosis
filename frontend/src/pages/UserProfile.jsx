import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/userProfile/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white py-12">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-700">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-3xl font-bold">{user.username}</h2>
        <p className="text-gray-300 mt-2">{user.email}</p>

        <div className="mt-6 bg-gray-700 p-4 rounded-lg text-left">
          <h3 className="text-lg font-semibold mb-2">Bio</h3>
          <p className="text-gray-300">{user.bio || "No bio added yet."}</p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
            onClick={() => navigate(`/updateProfile/${id}`)}
          >
            Edit Profile
          </button>

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg transition"
            onClick={() => navigate(`/updateBio/${id}`)}
          >
            Update Bio
          </button>

          <button
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg transition"
            onClick={() => navigate(`/repo/user/${id}`)}
          >
            View All Repositories
          </button>

          <button
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
            onClick={() => navigate(`/deleteProfile/${id}`)}
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
