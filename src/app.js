const express = require("express");
const { nanoid } = require("nanoid");
const path = require("path");
const fs = require("fs");

const port = 3000;

const app = express();

app.use(express.json());

const file = path.join(__dirname, "..", "data", "urls.json");

function readUrlFile() {
  if (!fs.existsSync(file)) {
    return {};
  }
  const jsonData = fs.readFileSync(file, "utf-8");
  return JSON.parse(jsonData);
}

function writeUrlFile(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(file, jsonData, "utf-8");
}

app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Invalid or Missing originalUrl" });
  }

  const shortId = nanoid(6);
  const shortUrl = `http://localhost:${port}/${shortId}`;

  const urlData = readUrlFile();
  urlData[shortId] = url;
  writeUrlFile(urlData);

  res.status(201).json({
    url,
    shortUrl,
    shortId,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
