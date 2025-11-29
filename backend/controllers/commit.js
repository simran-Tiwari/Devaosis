


const fs = require("fs").promises;
const path = require("path");
const { getCurrentBranch } = require("./branch.js");

async function commitRepo(repoId, message) {
  const repoRoot = path.resolve(process.cwd(), ".devo");
  const stagingPath = path.join(repoRoot, "staging");
  const commitsPath = path.join(repoRoot, "commits");
  const repoJsonPath = path.join(repoRoot, "repo.json");

  try {
    const branch = await getCurrentBranch(repoId);
    const branchStaging = path.join(stagingPath, branch);
    const branchCommits = path.join(commitsPath, branch);
    await fs.mkdir(branchCommits, { recursive: true });

    const files = await fs.readdir(branchStaging);
    if (files.length === 0) {
      console.log("Nothing to commit.");
      return;
    }

    const commitID = `commit_${Date.now()}`;
    const commitPath = path.join(branchCommits, commitID);
    await fs.mkdir(commitPath);

    // Copy staged files to commit folder
    for (const file of files) {
      await fs.copyFile(path.join(branchStaging, file), path.join(commitPath, file));
    }

    // Clear staging
    for (const file of files) {
      await fs.unlink(path.join(branchStaging, file));
    }

    // Update repo.json to store commit history
    let repoData = { repositories: [] };
    try {
      const raw = await fs.readFile(repoJsonPath, "utf-8");
      repoData = JSON.parse(raw);
    } catch {}

    const repo = repoData.repositories.find(r => r.id === repoId);
    if (!repo) throw new Error(`Repo ${repoId} not found`);

    if (!repo.commits) repo.commits = [];
    repo.commits.push({
      id: commitID,
      branch,
      message,
      timestamp: Date.now(),
      files,
    });

    await fs.writeFile(repoJsonPath, JSON.stringify(repoData, null, 2));

    console.log(`✅ Committed ${files.length} file(s) to '${branch}' with message: "${message}"`);
  } catch (err) {
    console.error("❌ Error committing:", err);
  }
}

module.exports = { commitRepo };
