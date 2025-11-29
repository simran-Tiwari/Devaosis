

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileTree from "../components/FileTree";

export default function FileTreePage() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/repo/${repoId}`)
      .then(res => res.json())
      .then(data => { setTree(Array.isArray(data) ? data[0]?.files || [] : data.files || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [repoId]);

  if (loading) return <p className="text-white p-8">Loading files...</p>;

  const handleFileClick = (file) => {
    navigate(`/repo/${repoId}/code`, { state: { filePath: file } });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
      <div className="w-1/3 bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-semibold text-white mb-3">File Explorer</h2>
        <FileTree tree={tree} onFileClick={handleFileClick} />
      </div>
      <div className="flex-1 bg-gray-800 p-4 rounded text-gray-300">Select a file to view</div>
    </div>
  );
}

