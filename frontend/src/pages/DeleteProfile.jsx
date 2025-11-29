import { useParams, useNavigate } from "react-router-dom";
import server from "../enviroment";
export default function DeleteProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await fetch(`${server}/deleteProfile/${id}`, { method: "DELETE" });
      alert("Profile deleted successfully");
      navigate("/signup"); 
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-6">Delete Profile</h2>
        <p className="mb-6">This action cannot be undone.</p>
        <button onClick={handleDelete} className="bg-red-600 px-6 py-2 rounded hover:bg-red-700">
          Delete Profile
        </button>
      </div>
    </div>
  );
}
