require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const connectDB = require("./models/db");
const { getGlobalStore, setGlobalStore } = require("./models/globalStore");
const {
  gameInfo,
  socialLinks,
  contributors,
} = require("./models/ModularSchema");

app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);
app.set("view engine", "ejs");

const getBaseUrl = (req) => {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }

  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol =
    req.secure || forwardedProto === "https" || forwardedProto === "https,http"
      ? "https"
      : "http";

  return `${protocol}://${req.get("host")}`;
};

app.get("/sitemap.xml", (req, res) => {
  const baseUrl = getBaseUrl(req);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  res.type("application/xml");
  res.send(sitemap);
});

app.get("/robots.txt", (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
});

app.get("/health/cache", (req, res) => {
  const store = getGlobalStore();
  res.json({
    ok: true,
    message: "In-memory cache is active",
    size: Object.keys(store).length,
  });
});

app.use(express.static("public"));

// Connect to MongoDB and initialize the in-memory store
connectDB().catch((error) => {
  console.error("MongoDB startup error:", error);
});

// custom routes
app.get("/", async (req, res) => {
  try {
    const cacheKey = "gogame:home";
    const store = getGlobalStore();

    if (store[cacheKey]) {
      const cachedPage = store[cacheKey];
      return res.render("Home", {
        data: cachedPage.data || [],
        socialLinks: cachedPage.socialLinks || [],
        contributors: cachedPage.contributors || [],
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const [gamesResult, scLinksResult, contriListResult] =
      await Promise.allSettled([
        gameInfo.find().lean(),
        socialLinks.find().lean(),
        contributors.find().lean(),
      ]);

    const pageData = {
      data: gamesResult.status === "fulfilled" ? gamesResult.value : [],
      socialLinks:
        scLinksResult.status === "fulfilled" ? scLinksResult.value : [],
      contributors:
        contriListResult.status === "fulfilled" ? contriListResult.value : [],
    };

    if (
      gamesResult.status === "fulfilled" ||
      scLinksResult.status === "fulfilled" ||
      contriListResult.status === "fulfilled"
    ) {
      setGlobalStore(cacheKey, pageData);
    }

    res.render("Home", pageData);
  } catch (err) {
    console.error(err);
    res.render("Home", {
      data: [],
      socialLinks: [],
      contributors: [],
    });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
