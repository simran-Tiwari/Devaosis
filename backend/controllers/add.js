


const fs = require("fs").promises;
const path = require("path");
const { getCurrentBranch, initRepo } = require("./branch.js");

// Adds a file to a repo (respects current branch)
async function addRepo(filePath, repoId) {
  try {
    // Initialize repo folder and branches
    const { repoPath } = await initRepo(repoId);

    // Get current branch
    const branch = await getCurrentBranch(repoId);

    // Ensure branch folder exists
    const branchPath = path.join(repoPath, "branches", branch);
    await fs.mkdir(branchPath, { recursive: true });

    // Copy file into branch folder
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(branchPath, fileName));

    // Read file content
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Update repo.json
    const repoJsonPath = path.join(repoPath, "repo.json");
    let repoData = { id: repoId, name: "Untitled Repo", content: [] };

    try {
      const raw = await fs.readFile(repoJsonPath, "utf-8");
      repoData = JSON.parse(raw);
    } catch {}

    // Remove duplicates for same file & branch
    repoData.content = repoData.content.filter(f => !(f.name === fileName && f.branch === branch));

    // Add new file
    repoData.content.push({ name: fileName, branch, content: fileContent });

    // Save repo.json
    await fs.writeFile(repoJsonPath, JSON.stringify(repoData, null, 2));

    console.log(`✅ File '${fileName}' added to repo '${repoId}' in branch '${branch}'`);
  } catch (err) {
    console.error("❌ Error adding file:", err);
  }
}

module.exports = { addRepo };
