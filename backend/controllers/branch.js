
const fs = require("fs").promises;
const path = require("path");

// Root .devo folder
const devoPath = path.resolve(process.cwd(), ".devo");
// Stores all repos by ID
const reposPath = path.join(devoPath, "repos");

async function initRepo(repoId) {
  const repoPath = path.join(reposPath, repoId);
  await fs.mkdir(repoPath, { recursive: true });

  const branchesPath = path.join(repoPath, "branches");
  const currentBranchFile = path.join(repoPath, "CURRENT_BRANCH.txt");

  await fs.mkdir(branchesPath, { recursive: true });

  const exists = await fs.access(currentBranchFile).then(() => true).catch(() => false);
  if (!exists) {
    await fs.writeFile(currentBranchFile, "main");
    await fs.mkdir(path.join(branchesPath, "main"), { recursive: true });
  }

  return { repoPath, branchesPath, currentBranchFile };
}

// Create a new branch inside a repo
async function createBranch(repoId, branchName) {
  const { branchesPath } = await initRepo(repoId);
  const branchPath = path.join(branchesPath, branchName);

  const exists = await fs.access(branchPath).then(() => true).catch(() => false);
  if (exists) throw new Error(`Branch ${branchName} already exists!`);

  await fs.mkdir(branchPath);
  console.log(`Branch '${branchName}' created in repo ${repoId}`);
}

// Switch current branch of a repo
async function switchBranch(repoId, branchName) {
  const { branchesPath, currentBranchFile } = await initRepo(repoId);
  const branchPath = path.join(branchesPath, branchName);

  const exists = await fs.access(branchPath).then(() => true).catch(() => false);
  if (!exists) throw new Error(`Branch ${branchName} does not exist in repo ${repoId}!`);

  await fs.writeFile(currentBranchFile, branchName);
  console.log(`Switched to branch '${branchName}' in repo ${repoId}`);
}

// Get current branch of a repo
async function getCurrentBranch(repoId) {
  const { currentBranchFile } = await initRepo(repoId);
  const branch = await fs.readFile(currentBranchFile, "utf-8");
  return branch.trim();
}

// Get files for current branch (for frontend)
async function getFilesForCurrentBranch(repoId) {
  const { repoPath } = await initRepo(repoId);
  const branch = await getCurrentBranch(repoId);

  const repoJsonFile = path.join(repoPath, "repo.json");
  let repoData = { content: [] };

  try {
    const raw = await fs.readFile(repoJsonFile, "utf-8");
    repoData = JSON.parse(raw);
  } catch {}

  // Only files for current branch
  const files = repoData.content.filter(f => f.branch === branch);
  return { ...repoData, content: files, currentBranch: branch };
}

module.exports = { initRepo, createBranch, switchBranch, getCurrentBranch, getFilesForCurrentBranch };
