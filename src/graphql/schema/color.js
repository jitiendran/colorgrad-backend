const mongoose = require("mongoose");

const colorSchema = mongoose.Schema({
    UserId: String,
    Colors: String,
    Type: String,
    UsedBy: Number,
});

module.exports = mongoose.model("Colors", colorSchema);
