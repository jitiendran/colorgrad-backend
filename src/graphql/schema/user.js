const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Username: String,
  Email: String,
  Password: String,
  LinkedinProfile: String,
  GithubProfile: String,
  Followers: [String],
  Following: [String],
  No_Of_Colors: Number,
  No_Of_Gradients: Number,
  Rating: Number,
});

module.exports = mongoose.model("user_info", userSchema);
