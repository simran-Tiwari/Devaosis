
const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");
const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getCurrentBranch } = require("./branch.js");

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function pullRepo(repoId) {
  const repoPath = path.resolve(process.cwd(), ".devo");
  const commitsPath = path.join(repoPath, "commits");
  const repoJsonPath = path.join(repoPath, "repo.json");

  try {
    const branch = await getCurrentBranch();
    const data = await s3.send(new ListObjectsV2Command({ Bucket: S3_BUCKET, Prefix: `${branch}/` }));
    if (!data.Contents) return;

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

    for (const obj of data.Contents) {
      const key = obj.Key;
      const relativePath = key.split("/").slice(1).join("/"); // remove branch prefix
      const commitDir = path.join(commitsPath, branch, path.dirname(relativePath));
      await fs.mkdir(commitDir, { recursive: true });

      const response = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
      const buffer = await streamToBuffer(response.Body);
      await fs.writeFile(path.join(commitsPath, branch, relativePath), buffer);

      // Update repo.json
      const fileName = path.basename(relativePath);
      const fileContent = buffer.toString("utf-8");
      // Remove duplicates in same branch
      repo.content = repo.content.filter(f => !(f.name === fileName && f.branch === branch));
      repo.content.push({ name: fileName, branch, content: fileContent });
    }

    await fs.writeFile(repoJsonPath, JSON.stringify(repoData, null, 2));
    console.log(`✅ All commits for branch '${branch}' pulled from S3 and updated repo.json`);
  } catch (err) {
    console.error("❌ Error pulling:", err);
  }
}

module.exports = { pullRepo };
