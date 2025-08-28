require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./models/db");
const {
  gameInfo,
  socialLinks,
  contributors,
} = require("./models/ModularSchema");

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// Connect to MongoDB
connectDB();

// custom routes
app.get("/", async (req, res) => {
  try {
    const games = await gameInfo.find();
    const scLinks = await socialLinks.find();
    const contriList = await contributors.find();
    res.render("Home", {
      data: games,
      socialLinks: scLinks,
      contributors: contriList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
