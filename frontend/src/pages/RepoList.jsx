import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RepoList() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRepos = async () => {
    try {
      const res = await fetch("http://localhost:3000/repo/all");
      const data = await res.json();
      setRepos(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch repositories", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading repositories...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <h1>Repositories</h1>
      <Link to="/new-repo">
        <button style={{ marginBottom: "1rem" }}>Create New Repository</button>
      </Link>

      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        repos.map((repo) => (
          <div
            key={repo._id}
            style={{
              background: "#f7f7f7",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Link to={`/repo/${repo._id}`} style={{ textDecoration: "none" }}>
              <h2>{repo.name}</h2>
            </Link>
            <p>{repo.description}</p>
            <p>
              Visibility:{" "}
              <strong style={{ color: repo.visibility ? "green" : "red" }}>
                {repo.visibility ? "Public" : "Private"}
              </strong>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
