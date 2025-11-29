// ================== IMPORTS ==================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

// Routers
const mainRouter = require("./routes/main.router.js"); // removed src/

// CLI Commands
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init.js");
const { addRepo } = require("./controllers/add.js");
const { commitRepo } = require("./controllers/commit.js");
const { pushRepo } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");
const { createBranch, switchBranch } = require("./controllers/branch.js");
const { mergeBranch } = require("./controllers/merge.js");

dotenv.config();

// ================== SERVER FUNCTION ==================
function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  // MongoDB Connection
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Error:", err));

  // Mount Router
  app.use("/", mainRouter);

  // Socket.io
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      socket.join(userID);
      console.log("User joined room:", userID);
    });
  });

  httpServer.listen(port, () => {
    console.log(`🚀 Server running on PORT ${port}`);
  });
}

// ================== YARGS COMMANDS ==================
yargs(hideBin(process.argv))
  .command("start", "Starts the server", {}, startServer)
  .command("init", "Initialize repo", {}, initRepo)
  .command("add <file>", "Add file", (yargs) => {
    yargs.positional("file", { describe: "File to add", type: "string" });
  }, (argv) => addRepo(argv.file))
  .command("commit <message>", "Commit files", (yargs) => {
    yargs.positional("message", { describe: "Commit message", type: "string" });
  }, (argv) => commitRepo(argv.message))
  .command("push", "Push commits", {}, pushRepo)
  .command("pull", "Pull commits", {}, pullRepo)
  .command("revert <commitID>", "Revert commit", (yargs) => {
    yargs.positional("commitID", { describe: "Commit ID", type: "string" });
  }, (argv) => revertRepo(argv.commitID))
  .command("branch create <name>", "Create branch", (yargs) => {
    yargs.positional("name", { describe: "Branch name", type: "string" });
  }, (argv) => createBranch(argv.name))
  .command("branch switch <name>", "Switch branch", (yargs) => {
    yargs.positional("name", { describe: "Branch name", type: "string" });
  }, (argv) => switchBranch(argv.name))
  .command("merge <name>", "Merge branch", (yargs) => {
    yargs.positional("name", { describe: "Branch to merge into current", type: "string" });
  }, (argv) => mergeBranch(argv.name))
  .demandCommand(1)
  .help().argv;
