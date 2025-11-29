

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
  return client.db("Devaosis");
}

/* ============================================================
   ✅ SIGNUP
============================================================ */
async function signup(req, res) {
  const { username, email, password, bio } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const exist = await users.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashed,
      bio: bio || "", // default empty if not provided
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await users.insertOne(newUser);

    const user = {
      id: result.insertedId,
      username,
      email,
      bio: newUser.bio,
    };

    const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user,
      token,
    });

  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

/* ============================================================
   ✅ LOGIN
============================================================ */
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email/password!" });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email!" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
      },
      token,
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

/* ============================================================
   ✅ GET ALL USERS
============================================================ */
async function getAllUsers(req, res) {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const all = await users.find().toArray();
    res.json(all);

  } catch (err) {
    console.error("Get Users Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

/* ============================================================
   ✅ GET USER PROFILE
============================================================ */
async function getUserProfile(req, res) {
  const { id } = req.params;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(id) });

    if (!user) return res.status(404).json({ message: "User not found!" });

    res.json(user);

  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

/* ============================================================
   ✅ UPDATE USER PROFILE
============================================================ */
async function updateUserProfile(req, res) {
  const { id } = req.params;
  const { email, password, bio } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const update = {};
    if (email) update.email = email;
    if (password) update.password = await bcrypt.hash(password, 10);
    if (bio !== undefined) update.bio = bio;

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(result.value);

  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

/* ============================================================
   ✅ DELETE USER PROFILE
============================================================ */
async function deleteUserProfile(req, res) {
  const { id } = req.params;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const result = await users.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}
// ------------------- UPDATE USER BIO -------------------
async function updateUserBio(req, res) {
  const { id } = req.params;
  const { bio } = req.body;

  if (bio === undefined) return res.status(400).json({ message: "Bio is required" });

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { bio } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "Bio updated successfully", user: result.value });
  } catch (err) {
    console.error("Update Bio Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  updateUserBio, // <-- add this
};

