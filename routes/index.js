// routes/index.js
import express from "express";
const router = express.Router();
import pool from "../db/index.js";



// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in to view this resource.");
  res.redirect("/login");
}








router.get("/codes", ensureAuthenticated, (req, res) => {
  res.render("codes", {
    adminCode: process.env.ADMIN_CODE,
    memberCode: process.env.MEMBER_CODE || "Not set",
  });
});

// Middleware to check admin


router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT messages.*, users.first_name, users.last_name
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at DESC
    `);
    res.render("index", { messages: result.rows });
  } catch (err) {
    console.error("Error in / route:", err);
    res.status(500).send("Server Error");
  }
});

export default router;
