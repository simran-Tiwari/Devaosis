

// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const UserSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//     },
//     repositories: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Repository",
//         default: [],
//       },
//     ],
//     followedUsers: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         default: [],
//       },
//     ],
//     starRepos: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Repository",
//         default: [],
//       },
//     ],
//   },
//   {
//     timestamps: {
//       createdAt: "created_on",
//       updatedAt: "updated_on",
//     },
//   }
// );

// const User = mongoose.model("User", UserSchema);
// module.exports = User;


const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    bio: {
      type: String,
      default: "", // empty by default
    },
    repositories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        default: [],
      },
    ],
    followedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    starRepos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        default: [],
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    },
  }
);
