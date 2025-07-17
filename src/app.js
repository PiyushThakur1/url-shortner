const express = require("express");
const { nanoid } = require("nanoid");
const path = require("path");

const fs = require("fs").promises;

const port = 3000;

const app = express();

app.use(express.json());

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

app.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid or Missing originalUrl" });
    }

    const shortId = nanoid(6);
    const shortUrl = `http://localhost:${port}/${shortId}`;

    const urlData = await readUrlFile();
    urlData[shortId] = url;
    await writeUrlFile(urlData);

    res.status(201).json({
      url,
      shortUrl,
      shortId,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
