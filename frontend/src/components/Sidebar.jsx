// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ repoId }) {
  const location = useLocation();

  const links = [
    { name: "Code", path: `/repo/${repoId}/code` },
    { name: "File Tree", path: `/repo/${repoId}/tree` },
    { name: "Issues", path: `/repo/${repoId}/issues` },
    { name: "Pull Requests", path: `/repo/${repoId}/pulls` }, // Placeholder for future
    { name: "Settings", path: `/repo/${repoId}/settings` },    // Placeholder for future
  ];

  return (
    <div className="sidebar w-48 bg-gray-50 p-4 rounded shadow-md flex flex-col space-y-2">
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`px-3 py-2 rounded transition-colors hover:bg-blue-100 ${
              isActive ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
