const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Username: String,
    Email: String,
    Password: String,
    LinkedinProfile: String,
    GithubProfile: String,
    Colors: [
        {
            ColorId: String,
            Colors: String,
            Type: String,
            UsedBy: Number,
        },
    ],
    Gradients: [
        {
            GradientId: String,
            Colors: [String],
            Type: String,
            Direction: String,
            UsedBy: Number,
        },
    ],
    Followers: [
        { _id: String, Username: String, Email: String, Profile: String },
    ],
    Following: [
        { _id: String, Username: String, Email: String, Profile: String },
    ],
    No_Of_Colors: Number,
    No_Of_Gradients: Number,
    Rating: Number,
    Token: String,
    Profile: String,
});

module.exports = mongoose.model("user_info", userSchema);
