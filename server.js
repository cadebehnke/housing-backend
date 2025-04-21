const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect("mongodb+srv://behnkecade:Su2i9yCVWFqfGPaO@cluster0.5lbrbmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const messageSchema = new mongoose.Schema({
  name: String,
  age: Number,
  state: String,
  review: Number
});

const Message = mongoose.model("Message", messageSchema);

const joiSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  age: Joi.number().min(0).max(120).required(),
  state: Joi.string().min(2).max(100).required(),
  review: Joi.number().min(0).max(5).required()
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).send("Failed to retrieve messages.");
  }
});

app.post("/api/messages", async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newMessage = new Message(req.body);

  try {
    await newMessage.save();
    res.send({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).send("Error saving message.");
  }
});

const womenData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "women.json"), "utf8"));

app.get("/api/women", (req, res) => {
  res.json(womenData);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
