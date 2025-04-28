const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.options("/api/messages", cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

mongoose
  .connect("mongodb+srv://behnkecade:Su2i9yCVWFqfGPaO@cluster0.5lbrbmw.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("✅ Connected to MongoDB..."))
  .catch((err) => console.error("❌ Could not connect to MongoDB...", err));

const messageSchema = new mongoose.Schema({
  name:    String,
  age:     Number,
  state:   String,
  review:  Number,
  message: String,
  img:     String, 
});
const Message = mongoose.model("Message", messageSchema);

const joiSchema = Joi.object({
  name:    Joi.string().min(2).max(100).required(),
  age:     Joi.number().integer().min(0).max(120).required(),
  state:   Joi.string().min(2).max(50).required(),
  review:  Joi.number().min(0).max(5).required(),
  message: Joi.string().min(5).max(500).required(),
  img:     Joi.allow(""), 
});

app.get("/api/messages", async (req, res) => {
  try {
    const msgs = await Message.find();
    res.json(msgs);
  } catch {
    res.status(500).send("Failed to fetch messages.");
  }
});

app.post("/api/messages", upload.single("img"), async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newMsg = new Message({
    name:    req.body.name,
    age:     req.body.age,
    state:   req.body.state,
    review:  req.body.review,
    message: req.body.message,
    img:     req.file ? "uploads/" + req.file.filename : ""
  });

  try {
    await newMsg.save();
    res.json(newMsg);
  } catch {
    res.status(500).send("Failed to save message.");
  }
});

app.put("/api/messages/:id", upload.single("img"), async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const fieldsToUpdate = {
    name:    req.body.name,
    age:     req.body.age,
    state:   req.body.state,
    review:  req.body.review,
    message: req.body.message,
  };

  if (req.file) {
    fieldsToUpdate.img = "uploads/" + req.file.filename;
  }

  try {
    const updatedMsg = await Message.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updatedMsg) return res.status(404).send("Message not found.");
    res.json(updatedMsg);
  } catch {
    res.status(500).send("Failed to update message.");
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    const deletedMsg = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMsg) return res.status(404).send("Message not found.");
    res.send("Message deleted successfully.");
  } catch {
    res.status(500).send("Failed to delete message.");
  }
});

const womenData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "women.json"), "utf8")
);
app.get("/api/women", (req, res) => {
  res.json(womenData);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
