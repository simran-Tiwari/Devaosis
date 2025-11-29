import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from '../enviroment'
export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${server}/allUsers` );
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-10 text-white">Loading users...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/userProfile/${user._id}`)}
              className="p-4 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-300">{user.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
