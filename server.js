// server.js
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import pool from "./db/index.js";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import messagesRouter from "./routes/messages.js";

dotenv.config();

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1day
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email" },

    async (email, password, done) => {
      try {
        const res = await pool.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);

        if (res.rows.length === 0) {
          // req.flash("error", "Incorrect email")
          return done(null, false, { message: "email doesn`t exits." });
        }

        const user = res.rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (match) {
          // req.flash("info", "Incorrect password");
          return done(null, user, {
            message: "you have successfully login!",
          });
        }

        return done(null, false, {
          message: "Incorrect password or Invalid email.",
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, res.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Routes;
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

// app.use((req, res, next) => {
//   res.locals.currentUser = req.user;
// res.locals.success = req.flash("success");

//   res.locals.error = req.flash("error");
//   res.locals.infos = req.flash("info");
//   next();
// });

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", messagesRouter);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
