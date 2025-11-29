import React, { useState } from "react";

function TreeNode({ node, onFileClick, parentPath = "" }) {
  const [open, setOpen] = useState(false);
  const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;

  if (node.type === "file") {
    return (
      <div className="pl-4 py-1 cursor-pointer hover:bg-gray-700 text-gray-200" onClick={() => onFileClick(fullPath)}>
        📄 {node.name}
      </div>
    );
  }

  return (
    <div className="pl-2 text-gray-200">
      <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-700 rounded" onClick={() => setOpen(!open)}>
        <span>{open ? "📂" : "📁"}</span>
        <span className="font-semibold">{node.name}</span>
      </div>

      {open && (
        <div className="pl-4 border-l border-gray-700">
          {node.children?.map((child, idx) => (
            <TreeNode key={idx} node={child} onFileClick={onFileClick} parentPath={fullPath} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ tree = [], onFileClick }) {
  return (
    <div className="text-sm">
      {tree.map((n, i) => <TreeNode key={i} node={n} onFileClick={onFileClick} />)}
    </div>
  );
}
