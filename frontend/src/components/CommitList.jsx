export default function CommitList({ commits }) {
  return (
    <div className="commit-list p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg space-y-4">
      <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2 mb-4">
        📝 Commit History
      </h3>

      {commits && commits.length > 0 ? (
        commits.map((commit) => (
          <div
            key={commit.id}
            className="commit-card p-4 bg-gray-900 rounded-lg border border-gray-700 shadow hover:shadow-lg transition duration-200"
          >
            <p className="font-medium text-gray-200 text-lg">{commit.message}</p>
            <div className="flex justify-between text-gray-400 mt-1 text-sm">
              <span>By {commit.author || "Unknown"}</span>
              <span>{new Date(commit.date).toLocaleString()}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center py-6">No commits found.</p>
      )}
    </div>
  );
}
