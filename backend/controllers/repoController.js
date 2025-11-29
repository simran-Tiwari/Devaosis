


const fs = require("fs").promises;
const path = require("path");

// Base folder for all repositories
const repoBase = path.resolve(process.cwd(), ".devo");

// Ensure .devo folder exists
fs.mkdir(repoBase, { recursive: true })
  .catch(err => console.error("Failed to create .devo folder:", err));

/* ============================================================
   CREATE REPOSITORY
============================================================ */
async function createRepository(req, res) {
  try {
    const { name, description = "", visibility = true, owner } = req.body;

    if (!name) return res.status(400).json({ error: "Repository name is required" });
    if (!owner) return res.status(400).json({ error: "Owner ID is required" });

    const repoPath = path.join(repoBase, name);

    // Check if repo already exists
    try {
      await fs.access(repoPath);
      return res.status(400).json({ error: "Repository with this name already exists" });
    } catch (_) { /* not exists */ }

    // Repo JSON structure
    const repoJson = {
      name,
      description,
      visibility: visibility ? "public" : "private",
      owner,
      content: [],
      branches: ["main"],
      currentBranch: "main"
    };

    // Create directories
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(path.join(repoPath, "branches"), { recursive: true });
    await fs.mkdir(path.join(repoPath, "branches", "main"), { recursive: true });

    // Write repo.json
    await fs.writeFile(
      path.join(repoPath, "repo.json"),
      JSON.stringify(repoJson, null, 2)
    );

    // Current branch file
    await fs.writeFile(path.join(repoPath, "CURRENT_BRANCH.txt"), "main");

    // Return complete repo data (use folder name as _id)
    res.status(201).json({ _id: name, ...repoJson });
  } catch (err) {
    console.error("Error creating repository:", err);
    res.status(500).json({ error: "Failed to create repository" });
  }
}

/* ============================================================
   GET ALL REPOSITORIES
   -> returns { repositories: [...] }
============================================================ */
async function getAllRepositories(req, res) {
  try {
    const repoDirs = await fs.readdir(repoBase);
    const repos = [];

    for (const dir of repoDirs) {
      try {
        const jsonPath = path.join(repoBase, dir, "repo.json");
        const data = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
        repos.push({ _id: dir, ...data });
      } catch (_) { /* skip invalid */ }
    }

    res.json({ repositories: repos });
  } catch (err) {
    console.error("Error fetching repositories:", err);
    res.status(500).json({ error: "Failed to get repositories" });
  }
}

/* ============================================================
   GET REPOSITORY BY ID
   -> returns { _id, ...repoData, currentBranch }
============================================================ */
async function fetchRepositoryById(req, res) {
  try {
    const { id } = req.params;
    const repoPath = path.join(repoBase, id);

    const repoJsonPath = path.join(repoPath, "repo.json");
    const repoData = JSON.parse(await fs.readFile(repoJsonPath, "utf-8"));

    let currentBranch = "main";
    try {
      currentBranch = (await fs.readFile(path.join(repoPath, "CURRENT_BRANCH.txt"), "utf-8")).trim();
    } catch (_) {}

    res.json({ _id: id, ...repoData, currentBranch });
  } catch (err) {
    console.error("Error fetching repository:", err);
    res.status(404).json({ error: "Repository not found" });
  }
}

/* ============================================================
   GET REPOSITORY BY NAME
   -> returns { repositories: [...] } (matches by repo.json.name)
============================================================ */
async function fetchRepositoryByName(req, res) {
  try {
    const { name } = req.params;
    const repoDirs = await fs.readdir(repoBase);
    const matches = [];

    for (const dir of repoDirs) {
      try {
        const json = JSON.parse(await fs.readFile(path.join(repoBase, dir, "repo.json"), "utf-8"));
        if (json.name.toLowerCase() === name.toLowerCase()) {
          matches.push({ _id: dir, ...json });
        }
      } catch (_) {}
    }

    res.json({ repositories: matches });
  } catch (err) {
    console.error("Error fetching repository by name:", err);
    res.status(500).json({ error: "Failed to fetch repository by name" });
  }
}

/* ============================================================
   GET USER'S REPOSITORIES
   -> returns { repositories: [...] }
============================================================ */
async function fetchRepositoriesForCurrentUser(req, res) {
  try {
    const { userID } = req.params;

    const repoDirs = await fs.readdir(repoBase);
    const userRepos = [];

    for (const dir of repoDirs) {
      try {
        const json = JSON.parse(await fs.readFile(path.join(repoBase, dir, "repo.json"), "utf-8"));
        if (json.owner === userID) userRepos.push({ _id: dir, ...json });
      } catch (_) {}
    }

    res.json({ repositories: userRepos });
  } catch (err) {
    console.error("Error fetching user repositories:", err);
    res.status(500).json({ error: "Failed to fetch user repositories" });
  }
}

/* ============================================================
   UPDATE REPOSITORY
   -> returns { message, repository: { _id, ... } }
============================================================ */
async function updateRepositoryById(req, res) {
  try {
    const { id } = req.params; // current folder name
    const { content, description, name: newName, branch } = req.body;

    const repoPath = path.join(repoBase, id);
    const repoJsonPath = path.join(repoPath, "repo.json");
    const repoData = JSON.parse(await fs.readFile(repoJsonPath, "utf-8"));

    // Update description
    if (description) repoData.description = description;

    // Update content
    if (content) {
      repoData.content.push({
        ...content,
        branch: branch || repoData.currentBranch,
      });
      if (branch && !repoData.branches.includes(branch)) {
        repoData.branches.push(branch);
      }
    }

    // Update name if changed
    if (newName && newName !== repoData.name) {
      const newRepoPath = path.join(repoBase, newName);
      // check if folder exists
      try {
        await fs.access(newRepoPath);
        return res.status(400).json({ error: "Repository with this name already exists" });
      } catch (_) {}
      // rename folder
      await fs.rename(repoPath, newRepoPath);
      repoData.name = newName;
    }

    // Write updated repo.json (folder may be renamed)
    const finalJsonPath = path.join(repoBase, repoData.name, "repo.json");
    await fs.writeFile(finalJsonPath, JSON.stringify(repoData, null, 2));

    res.json({ message: "Repository updated", repository: { _id: repoData.name, ...repoData } });
  } catch (err) {
    console.error("Error updating repository:", err);
    res.status(500).json({ error: "Failed to update repository" });
  }
}
/* ============================================================
   TOGGLE VISIBILITY
   -> returns { message, repository: { _id, ... } }
============================================================ */
async function toggleVisibilityById(req, res) {
  try {
    const { id } = req.params;

    const repoJsonPath = path.join(repoBase, id, "repo.json");
    const repoData = JSON.parse(await fs.readFile(repoJsonPath, "utf-8"));

    repoData.visibility = repoData.visibility === "public" ? "private" : "public";

    await fs.writeFile(repoJsonPath, JSON.stringify(repoData, null, 2));

    res.json({ message: "Visibility updated", repository: { _id: id, ...repoData } });
  } catch (err) {
    console.error("Error toggling visibility:", err);
    res.status(500).json({ error: "Failed to toggle visibility" });
  }
}

/* ============================================================
   GET BRANCHES
   -> returns { branches: [...], currentBranch }
============================================================ */
async function getBranches(req, res) {
  try {
    const { id } = req.params;
    const branchesPath = path.join(repoBase, id, "branches");
    const branchDirs = await fs.readdir(branchesPath).catch(() => ["main"]);

    let currentBranch = "main";
    try {
      currentBranch = (await fs.readFile(path.join(repoBase, id, "CURRENT_BRANCH.txt"), "utf-8")).trim();
    } catch (_) {}

    res.json({ branches: branchDirs, currentBranch });
  } catch (err) {
    console.error("Error getting branches:", err);
    res.status(500).json({ error: "Failed to load branches" });
  }
}

/* ============================================================
   GET FILE CONTENT
   -> query params: ?repo=repoId&branch=main&filename=foo.txt
============================================================ */
async function getFileContent(req, res) {
  try {
    const { repo, branch, filename } = req.query;
    const filePath = path.join(repoBase, repo, "branches", branch, filename);
    const data = await fs.readFile(filePath, "utf-8");
    res.json({ filename, content: data });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(404).json({ error: "File not found" });
  }
}

/* ============================================================
   DELETE REPOSITORY
============================================================ */
async function deleteRepositoryById(req, res) {
  try {
    const { id } = req.params;
    const repoPath = path.join(repoBase, id);
    await fs.rm(repoPath, { recursive: true, force: true });
    res.json({ message: "Repository deleted" });
  } catch (err) {
    console.error("Error deleting repository:", err);
    res.status(500).json({ error: "Failed to delete repository" });
  }
}

/* ============================================================
   EXPORT
============================================================ */
module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  getBranches,
  getFileContent,
  deleteRepositoryById
};
