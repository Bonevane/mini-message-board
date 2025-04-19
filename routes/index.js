const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY added DESC"
    );
    res.render("index", { title: "Mini Messageboard", messages: result.rows });
  } catch (err) {
    console.error(err);
    res.send("Error fetching messages");
  } finally {
    client.release();
  }
});

// GET /new
router.get("/new", (req, res) => {
  res.render("form", { title: "New Message" });
});

// POST /new
router.post("/new", async (req, res) => {
  const client = await pool.connect();
  const { messageText, messageUser } = req.body;
  try {
    await pool.query(
      "INSERT INTO messages (user_name, message_text) VALUES ($1, $2)",
      [messageUser, messageText]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error adding message");
  } finally {
    client.release();
  }
});

// GET /message/:id
router.get("/message/:id", async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM messages WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res.render("message", {
        title: "Message Detail",
        message: result.rows[0],
      });
    } else {
      res.send("Message not found.");
    }
  } catch (err) {
    console.error(err);
    res.send("Error fetching message details.");
  } finally {
    client.release();
  }
});

module.exports = router;
