const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.static("public"));

const womenData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "women.json"), "utf8"));

app.get("/api/women", (req, res) => {
  res.json(womenData);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
