

const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getCurrentBranch } = require("./branch.js");

async function pushRepo(repoId) {
  const repoPath = path.resolve(process.cwd(), ".devo");
  const commitsPath = path.join(repoPath, "commits");
  const repoJsonPath = path.join(repoPath, "repo.json");

  try {
    const branch = await getCurrentBranch();
    const branchCommitsPath = path.join(commitsPath, branch);
    const commitDirs = await fs.readdir(branchCommitsPath);

    let repoData = { repositories: [] };
    try {
      const raw = await fs.readFile(repoJsonPath, "utf-8");
      repoData = JSON.parse(raw);
    } catch {}

    let repo = repoData.repositories.find(r => r.id === repoId);
    if (!repo) {
      repo = { id: repoId, name: "Untitled Repo", content: [] };
      repoData.repositories.push(repo);
    }

    for (const commitDir of commitDirs) {
      const commitPath = path.join(branchCommitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        // Push to S3
        await s3.send(new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: `${branch}/${commitDir}/${file}`,
          Body: fileContent,
        }));

        // Update repo.json
        const contentStr = fileContent.toString("utf-8");
        repo.content = repo.content.filter(f => !(f.name === file && f.branch === branch));
        repo.content.push({ name: file, branch, content: contentStr });
      }
    }

    await fs.writeFile(repoJsonPath, JSON.stringify(repoData, null, 2));
    console.log(`✅ All commits for branch '${branch}' pushed to S3 and updated repo.json`);
  } catch (err) {
    console.error("❌ Error pushing:", err);
  }
}

module.exports = { pushRepo };
