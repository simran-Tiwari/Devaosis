


import React, { useEffect, useState } from "react";

export default function CodeViewer({ content = "// Select a file to view" }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const c = content || "";
    let highlighted = c
      .replace(/(\/\*[\s\S]*?\*\/|\/\/.*)/g, '<span class="text-green-400">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|class|new|try|catch|throw)\b/g, '<span class="text-blue-400">$1</span>')
      .replace(/("[^"]*"|'[^']*')/g, '<span class="text-yellow-300">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-300">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-red-300">$1</span>');
    setFormatted(highlighted);
  }, [content]);

  const lines = (content || "").split("\n");

  return (
    <div className="rounded border border-gray-700 bg-[#1e1e1e] overflow-hidden max-h-[80vh]">
      <div className="flex font-mono text-sm">
        <div className="bg-[#161b22] text-gray-500 px-3 py-2 text-right select-none">
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="px-4 py-2 w-full text-gray-100 overflow-auto" style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: formatted }} />
      </div>
    </div>
  );
}
