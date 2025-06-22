// routes/messages.js
import express from "express";
const router = express.Router();
import pool from "../db/index.js";
import { body, validationResult } from "express-validator";

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in to view this resource.");
  res.redirect("/login");
}

// Middleware to check admin
function ensureAdmin(req, res, next) {
  if (req.user && req.user.is_admin) return next();
  req.flash("error", "Admin access required.");
  res.redirect("/");
}

// New Message
router.get("/new", ensureAdmin, (req, res) => {
  res.render("new_messages", { user: req.user, errors: [] });
});

router.post(
  "/new",
  ensureAdmin,

  [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("content").trim().notEmpty().withMessage("Content is required."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("new_message", {
        errors: errors.array(),
        user: req.user,
      });
    }
    const { title, content } = req.body;
    try {
      await pool.query(
        "INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3)",
        [title, content, req.user.id]
      );
      req.flash("info", "Message posted.");
      res.redirect("/");
    } catch (err) {
      req.flash("error", "Server Error");
      res.redirect("/new");
    }
  }
);

// List Messages (complicated: show user, admin, and flash info)
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT m.*, u.first_name, u.last_name, u.is_admin
      FROM messages m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.timestamp DESC
    `);
    res.render("index", {
      messages: rows,
      currentUser: req.user,
      infos: req.flash("info"),
      errors: req.flash("error"),
    });
  } catch (err) {
    req.flash("error", "Server Error");
    console.log(err);
    res.render("index", {
      messages: [],
      currentUser: req.user,
      infos: [],
      errors: ["Server Error"],
    });
  }
});

// // Alternative message creation (API-like)
router.get("/messages/new", ensureAuthenticated, (req, res) =>
  res.render("new", { user: req.user, errors: [] })
);
router.post("/messages", ensureAuthenticated, async (req, res) => {
  const { title, body: messageBody } = req.body;
  try {
    await pool.query(
      "INSERT INTO messages (user_id, title, body) VALUES ($1, $2, $3)",
      [req.user.id, title, messageBody]
    );
    req.flash("info", "Message created via API route.");
    res.redirect("/");
  } catch (err) {
    req.flash("error", "Server Error");
    res.redirect("/messages/new");
  }
});

// Admin delete (API-like)
router.post("/messages/:id/delete", ensureAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM messages WHERE id=$1", [req.params.id]);
    req.flash("info", "Message deleted (API route).");
    res.redirect("/");
  } catch (err) {
    req.flash("error", "Server Error");
    res.redirect("/");
  }
});

// Delete Message (admin only, with flash and error handling)
router.post("/delete/:id", ensureAuthenticated, async (req, res) => {
  if (!req.user.is_admin) {
    req.flash("error", "Unauthorized access.");
    return res.redirect("/");
  }

  const messageId = req.params.id;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM messages WHERE id = $1",
      [messageId]
    );
    if (rowCount === 0) {
      req.flash("error", "Message not found or already deleted.");
    } else {
      req.flash("info", "Message deleted.");
    }
    res.redirect("/");
  } catch (err) {
    req.flash("error", "Server Error");
    res.redirect("/");
  }
});

export default router;
