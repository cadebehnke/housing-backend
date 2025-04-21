const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Joi = require("joi");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/housing", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const messageSchema = new mongoose.Schema({
  name: String,
  age: Number,
  state: String,
  review: Number,
});

const Message = mongoose.model("Message", messageSchema);

const joiSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  age: Joi.number().integer().min(0).max(120).required(),
  state: Joi.string().min(2).max(50).required(),
  review: Joi.number().integer().min(1).max(5).required(),
});

app.get("/api/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post("/api/messages", async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const message = new Message(req.body);
  await message.save();
  res.status(200).json(message);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
