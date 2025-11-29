import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RepoCard from "../components/RepoCard";

export default function UserRepos() {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/repo/user/${userID}`);
        const data = await res.json();
        setRepos(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRepos();
  }, [userID]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Repositories</h1>
      {repos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <div key={repo._id} onClick={() => navigate(`/repo/${repo._id}`)}>
              <RepoCard repo={repo} />
            </div>
          ))}
        </div>
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
  );
}
