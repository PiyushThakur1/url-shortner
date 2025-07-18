const express = require("express");
const { nanoid } = require("nanoid");
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises;

const app = express();

app.use(express.json());
app.use(cors());
const file = path.join(__dirname, "..", "data", "urls.json");

// function readUrlFile() {
//   if (!fs.existsSync(file)) {
//     return {};
//   }
//   const jsonData = fs.readFileSync(file, "utf-8");
//   return JSON.parse(jsonData);
// }
async function readUrlFile() {
  try {
    await fs.access(file);
    const jsonData = await fs.readFile(file, "utf-8");
    return JSON.parse(jsonData);
  } catch (err) {
    return {};
  }
}

// function writeUrlFile(data) {
//   const jsonData = JSON.stringify(data, null, 2);
//   fs.writeFileSync(file, jsonData, "utf-8");
// }

async function writeUrlFile(data) {
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile(file, jsonData, "utf-8");
}

function validateUrl(req, res, next) {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Invalid or Missing originalUrl" });
  }

  next();
}

app.post("/shorten", validateUrl, async (req, res) => {
  const { url } = req.body;

  const shortId = nanoid(6);
  const shortUrl = `http://localhost:3000/${shortId}`;

  const urlData = await readUrlFile();
  const newEntry = {
    url: url,
    clicks: 0,
  };
  urlData[shortId] = newEntry;
  await writeUrlFile(urlData);

  res.status(201).json({
    originalUrl: url,
    shortUrl,
    shortId,
  });
});

app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const urls = await readUrlFile();
    const entry = urls[shortId];

    if (entry && entry.url) {
      entry.clicks += 1;
      await writeUrlFile(urls);
      res.redirect(entry.url);
    } else {
      res.status(404).send("Url not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000);
