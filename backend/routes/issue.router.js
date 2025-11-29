


const express = require("express");
const issueController = require("../controllers/issueController.js");

const issueRouter = express.Router();

// Create an issue
issueRouter.post("/issue/create", issueController.createIssue);

// Update an issue by ID
issueRouter.put("/issue/update/:id", issueController.updateIssueById);

// Delete an issue by ID
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);

// Get all issues for a repository (repoId in params)
issueRouter.get("/issue/all/:repoId", issueController.getAllIssues);

// Get a single issue by ID
issueRouter.get("/issue/:id", issueController.getIssueById);

module.exports = issueRouter;
