
const express = require("express");
const repoController = require("../controllers/repoController.js");

const repoRouter = express.Router();

// Repository CRUD
repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.get("/file-content", repoController.getFileContent);

// Branches
repoRouter.get("/repo/branches/:id", repoController.getBranches);

module.exports = repoRouter;
