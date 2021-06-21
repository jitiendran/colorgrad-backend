const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Username: String,
  Email: String,
  Password: String,
  LinkedinProfile: String,
  GithubProfile: String,
  Friends: [String],
  Colors: [{ Username: String, Colors: String, Type: String, UsedBy: Number }],
  Gradients: [
    {
      Username: String,
      Colors: [String],
      Type: String,
      Direction: String,
      UsedBy: Number,
    },
  ],
  Rating: Number,
});

module.exports = mongoose.model("user_info", userSchema);
