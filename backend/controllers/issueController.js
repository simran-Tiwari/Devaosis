
const mongoose = require("mongoose");
const Issue = require("../models/issueModel.js");

// ------------------- CREATE ISSUE -------------------
async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params; // repository ID

  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();
    res.status(201).json({ issue, message: "Issue created successfully!" });
  } catch (err) {
    console.error("Error during issue creation:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// ------------------- UPDATE ISSUE -------------------
async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    issue.title = title || issue.title;
    issue.description = description || issue.description;
    issue.status = status || issue.status;

    await issue.save();
    res.json({ issue, message: "Issue updated successfully!" });
  } catch (err) {
    console.error("Error during issue update:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// ------------------- DELETE ISSUE -------------------
async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json({ message: "Issue deleted successfully!" });
  } catch (err) {
    console.error("Error during issue deletion:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// ------------------- GET ALL ISSUES FOR A REPO -------------------
async function getAllIssues(req, res) {
  const { repoId } = req.params;

  try {
    const issues = await Issue.find({ repository: repoId });

    if (!issues || issues.length === 0) {
      return res.status(404).json({ error: "No issues found for this repository!" });
    }

    res.status(200).json({ issues });
  } catch (err) {
    console.error("Error fetching issues:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

// ------------------- GET ISSUE BY ID -------------------
async function getIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json({ issue });
  } catch (err) {
    console.error("Error fetching issue:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
