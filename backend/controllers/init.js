


const fs = require("fs").promises;
const path = require("path");
const { initBranches } = require("./branch.js");
const { v4: uuidv4 } = require("uuid");

async function initRepo(repoName = "Untitled Repo") {
  const repoPath = path.resolve(process.cwd(), ".devo");
  const commitsPath = path.join(repoPath, "commits");
  const repoJsonPath = path.join(repoPath, "repo.json");

  try {
    // Create folder structure
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await initBranches();

    // Write config.json if not exists
    const configPath = path.join(repoPath, "config.json");
    try {
      await fs.access(configPath);
    } catch {
      await fs.writeFile(
        configPath,
        JSON.stringify({ bucket: process.env.S3_BUCKET || "local" }, null, 2)
      );
    }

    // Initialize repo.json with repository ID and empty content/commits
    let repoData = { repositories: [] };
    try {
      const raw = await fs.readFile(repoJsonPath, "utf-8");
      repoData = JSON.parse(raw);
    } catch {}

    const repoId = uuidv4();
    repoData.repositories.push({
      id: repoId,
      name: repoName,
      content: [],
      commits: [],
    });

    await fs.writeFile(repoJsonPath, JSON.stringify(repoData, null, 2));

    console.log(`✅ Repository '${repoName}' initialized with ID: ${repoId}`);
    return repoId;
  } catch (err) {
    console.error("❌ Error initializing repo:", err);
  }
}

module.exports = { initRepo };
