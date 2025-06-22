// routes/auth.js
import express from "express";
const router = express.Router();
import pool from "../db/index.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { body, validationResult } from "express-validator";

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   req.flash("error", "Please log in to view this resource.");
//   res.redirect("/login");
// }

// Sign Up
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post(
  "/signup",
  [
    body("first_name").trim().notEmpty().withMessage("First name is required."),
    body("last_name").trim().notEmpty().withMessage("Last name is required."),
    body("email").isEmail().withMessage("Invalid email.").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("signup", { errors: errors.array() });
    }
    const { first_name, last_name, email, password, is_admin, is_member } =
      req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (first_name, last_name, email, password, is_admin, is_member) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          first_name,
          last_name,
          email,
          hashedPassword,
          is_admin === "on",
          is_member === "on",
        ]
      );
      req.flash("info", "Registration successful. Please log in.");
      res.redirect("/login");
    } catch (err) {
      req.flash("error", "Email already in use.");
      res.redirect("/signup");
    }
  }
);

// Login
router.get("/login", (req, res) => {
  res.render("login", {
    user: req.user,
    // errors: req.flash("error").map((msg) => ({ msg })),
    // infos: req.flash("info").map((msg) => ({ msg })),
    // messages: req.flash("error", "username or password is incorrect"),
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// router.get(
//   "/test-flash",
//          (req, res)=>{
//           req.flash("error",  "this is a test error")
//           res.redirect("/login")
//         }

// );

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("info", "You have logged out.");
    res.redirect("/");
  });
});

// Join Club
router.get("/join", (req, res) => {
  res.render("join", { messages: [] });
});

router.post("/join", async (req, res) => {
  const passcode = req.body.passcode;
  if (passcode === "secretcode") {
    try {
      await pool.query("UPDATE users SET is_member = TRUE WHERE id = $1", [
        req.user.id,
      ]);
      req.flash("info", "You are now a member!");
      res.redirect("/");
    } catch (err) {
      res.status(500).send("Server Error");
    }
  } else {
    req.flash("error", "Incorrect passcode.");
    res.redirect("/join");
  }
});

// router.get("/become-admin", (req, res) => res.render("admin"));
router.get("/become-admin", (req, res) => {
  res.render("admin", { messages: req.flash() });
});
router.post("/become-admin", async (req, res) => {
  // Check if the user is already an admin
  if (req.body.code === process.env.ADMIN_CODE) {
    try {
      await pool.query("UPDATE users SET is_admin=true WHERE id=$1", [
        req.user.id,
      ]);
      req.flash("info", "You are now a Admin!");
      res.redirect("/");
    } catch (error) {
      // res.status(500).send("Server Error");
      // Optionally, you can log the error for debugging purposes
      // This will help you identify issues in the become-admin route
      // console.error("Error in become-admin route:", err);
      req.flash("error", "An error occurred while becoming an admin.");
      console.error("Error in become-admin route:", error); // Log the error for debugging
    }
  } else {
    req.flash("error", "Incorrect passcode.");
    res.redirect("/become-admin");
  }
});
export default router;
