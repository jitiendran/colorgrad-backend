const mongoose = require("mongoose");

const gradientSchema = mongoose.Schema({
  UserId: String,
  Colors: [String],
  Type: String,
  Direction: String,
  Favourite: Boolean,
  UsedBy: Number,
});

module.exports = mongoose.model("Gradients", gradientSchema);
