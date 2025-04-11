const express = require("express");
const router = express.Router();

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];

// GET /
router.get("/", (req, res) => {
  res.render("index", {
    title: "Mini Messageboard",
    messages,
  });
});

// GET /new
router.get("/new", (req, res) => {
  res.render("form", { title: "New Message" });
});

// POST /new
router.post("/new", (req, res) => {
  const { messageText, messageUser } = req.body;
  messages.push({
    text: messageText,
    user: messageUser,
    added: new Date(),
  });
  res.redirect("/");
});

// GET /message/:id
router.get("/message/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const message = messages[id];
  if (!message) {
    return res.status(404).send("Message not found");
  }
  res.render("message", { title: "Message Detail", message });
});

module.exports = router;
