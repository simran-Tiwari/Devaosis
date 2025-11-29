// src/components/UserCard.jsx
import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <Link to={`/user/${user._id}`}>
      <div className="user-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <h2 className="text-lg font-semibold text-gray-800">{user.username}</h2>
        <p className="text-sm text-gray-500 mt-1">Email: {user.email}</p>
      </div>
    </Link>
  );
}
