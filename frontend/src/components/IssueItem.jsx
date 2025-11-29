export default function IssueItem({ issue }) {
  return (
    <div className="p-3 bg-gray-800 rounded border border-gray-700">
      <h4 className="font-semibold text-white">{issue.title}</h4>
      <p className="text-gray-300">{issue.description}</p>
      <small className={`font-medium ${issue.status === 'open' ? 'text-green-400' : 'text-red-400'}`}>Status: {issue.status}</small>
    </div>
  );
}
a