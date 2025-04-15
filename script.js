const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://behnkecade:Su2i9yCVWFqfGPaO@cluster0.5lbrbmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB..."))
  .catch((err) => console.error("❌ Could not connect to MongoDB...", err));

const messageSchema = new mongoose.Schema({
  name: String,
});
const Message = mongoose.model("Message", messageSchema);

const joiSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
});

app.get("/api/messages", async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

app.post("/api/messages", async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const message = new Message({ name: req.body.name });
  await message.save();
  res.send({ success: true, message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 Server running on port ${port}...`));
