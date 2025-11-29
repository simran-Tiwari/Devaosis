

const fs = require("fs").promises;
const path = require("path");
const { getCurrentBranch } = require("./branch.js");

const repoPath = path.resolve(process.cwd(), ".devo");
const branchesPath = path.join(repoPath, "branches");
const repoJsonPath = path.join(repoPath, "repo.json");

async function mergeBranch(branchName, repoId) {
  const currentBranch = await getCurrentBranch();
  if (branchName === currentBranch) {
    console.error("Cannot merge branch into itself!");
    return;
  }

  const source = path.join(branchesPath, branchName);
  const target = path.join(branchesPath, currentBranch);

  const exists = await fs.access(source).then(() => true).catch(() => false);
  if (!exists) {
    console.error(`Branch '${branchName}' does not exist!`);
    return;
  }

  // Merge files
  const files = await fs.readdir(source);
  for (const file of files) {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, file);
    const content = await fs.readFile(sourceFile);
    await fs.writeFile(targetFile, content); // overwrite
  }

  // Update repo.json for frontend fetch
  try {
    let repoData = { repositories: [] };
    try {
      const raw = await fs.readFile(repoJsonPath, "utf-8");
      repoData = JSON.parse(raw);
    } catch {}

    const repo = repoData.repositories.find(r => r.id === repoId);
    if (repo) {
      for (const file of files) {
        const fileContent = await fs.readFile(path.join(target, file), "utf-8");
        // Remove duplicate in current branch
        repo.content = repo.content.filter(f => !(f.name === file && f.branch === currentBranch));
        repo.content.push({ name: file, branch: currentBranch, content: fileContent });
      }
      await fs.writeFile(repoJsonPath, JSON.stringify(repoData, null, 2));
    }
  } catch (err) {
    console.error("Error updating repo.json:", err);
  }

  console.log(`✅ Branch '${branchName}' merged into '${currentBranch}'`);
}

module.exports = { mergeBranch };
