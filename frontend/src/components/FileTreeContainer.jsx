
import { useEffect, useState } from "react";
import FileTree from "./FileTree";
import CodeViewer from "./CodeViewer";
import axios from "axios";
import server from "../enviroment";
export default function FileTreeContainer({ repoId, initialFile }) {
  const [tree, setTree] = useState([]);
  const [fileContent, setFileContent] = useState("// Select a file to view");

  useEffect(() => {
    const fetchRepoFiles = async () => {
      try {
        const res = await axios.get(`${server}/repo/${repoId}`);
        const repoData = Array.isArray(res.data) ? res.data[0] : res.data;
        setTree(repoData.content || []); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchRepoFiles();
  }, [repoId]);

  
  const loadFile = async (fileName) => {
    try {
      const res = await axios.get(`${server}/file-content`, {
        params: { repoId, fileName },
      });
      setFileContent(res.data.content || "// Empty file");
    } catch (err) {
      console.error(err);
      setFileContent("// Failed to load file content");
    }
  };

  
  useEffect(() => {
    if (initialFile) loadFile(initialFile);
  }, [initialFile]);

  return (
    <div className="flex gap-4">
      {/* File Tree */}
      <div className="w-1/3 bg-gray-800 p-3 rounded max-h-[80vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-2 text-white">📁 File Explorer</h2>
        <FileTree tree={tree} onFileClick={loadFile} />
      </div>

      {/* Code Viewer */}
      <div className="flex-1 bg-gray-800 p-4 rounded max-h-[80vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-2 text-white">📝 Code Viewer</h2>
        <CodeViewer content={fileContent} />
      </div>
    </div>
  );
}
