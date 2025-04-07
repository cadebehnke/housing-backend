const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.static("public")); 

const houses = [
  {
    _id: 1,
    name: "Farmhouse",
    size: 2000,
    bedrooms: 3,
    bathrooms: 2.5,
    main_image: "images/farm.webp"
  },
  {
    _id: 2,
    name: "Mountain House",
    size: 1700,
    bedrooms: 3,
    bathrooms: 2,
    main_image: "images/mountain-house.webp"
  },
  {
    _id: 3,
    name: "Lake House",
    size: 3000,
    bedrooms: 4,
    bathrooms: 3,
    main_image: "images/farm.webp"
  }
];

app.get("/api/houses", (req, res) => {
  res.json(houses);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
