

const fs = require("fs").promises;
const path = require("path");
const { getCurrentBranch } = require("./branch.js");

async function revertRepo(repoId, commitID) {
  const repoPath = path.resolve(process.cwd(), ".devo");
  const commitsPath = path.join(repoPath, "commits");
  const stagingPath = path.join(repoPath, "staging");
  const repoJsonPath = path.join(repoPath, "repo.json");

  try {
    const branch = await getCurrentBranch();
    const commitPath = path.join(commitsPath, branch, commitID);

    const exists = await fs.access(commitPath).then(() => true).catch(() => false);
    if (!exists) {
      console.error("❌ Commit does not exist!");
      return;
    }

    // Ensure branch staging exists
    const branchStaging = path.join(stagingPath, branch);
    await fs.mkdir(branchStaging, { recursive: true });

    // Copy all files from commit to staging
    const files = await fs.readdir(commitPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(commitPath, file),
        path.join(branchStaging, file)
      );
    }

    // Update repo.json
    let repoData = { repositories: [] };
    try {
      const raw = await fs.readFile(repoJsonPath, "utf-8");
      repoData = JSON.parse(raw);
    } catch {}

    const repo = repoData.repositories.find(r => r.id === repoId);
    if (repo) {
      // Remove all files in this branch and add reverted ones
      repo.content = repo.content.filter(f => f.branch !== branch);
      for (const file of files) {
        const content = await fs.readFile(path.join(commitPath, file), "utf-8");
        repo.content.push({ name: file, branch, content });
      }
    }

    await fs.writeFile(repoJsonPath, JSON.stringify(repoData, null, 2));

    console.log(`✅ Branch '${branch}' reverted to commit '${commitID}'`);
  } catch (err) {
    console.error("❌ Error reverting:", err);
  }
}

module.exports = { revertRepo };
