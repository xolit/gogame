const mongoose = require("mongoose");

// contributors section
const contributorsSchema = new mongoose.Schema({
  name: String,
  role: String,
});
const contributors = mongoose.model("contributors", contributorsSchema);

// game info section
const infoSchema = new mongoose.Schema({
  title: String,
  description: String,
  engine: String,
  platform: String,
  comingSoon: Boolean,
  downloadLink: String,
});
const gameInfo = mongoose.model("gameInfo", infoSchema);

// social links section
const scLinks = new mongoose.Schema({
  title: String,
  link: String,
});
const socialLinks = mongoose.model("social", scLinks);

// Export the Social and Info models
module.exports = { socialLinks, gameInfo, contributors };
