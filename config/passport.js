// config/passport.js
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const res = await pool.query("SELECT * FROM users WHERE email=$1", [
            email,
          ]);
          if (!res.rows.length)
            return done(null, false, { message: "No user" });
          const user = res.rows[0];
          const match = await bcrypt.compare(password, user.password_hash);
          if (match) return done(null, user);
          else return done(null, false, { message: "Incorrect password" });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const res = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    done(null, res.rows[0]);
  });
};
