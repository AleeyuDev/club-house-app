// routes/membership.js
router.get("/join", (req, res) => res.render("join"));
router.post("/join", (req, res) => {
  if (req.body.code === process.env.MEMBER_CODE) {
    pool.query("UPDATE users SET membership_status=true WHERE id=$1", [
      req.user.id,
    ]);
  }
  res.redirect("/");
});
router.get("/become-admin", (req, res) => res.render("admin"));
router.post("/become-admin", (req, res) => {
  if (req.body.code === process.env.ADMIN_CODE) {
    pool.query("UPDATE users SET is_admin=true WHERE id=$1", [req.user.id]);
  }
  res.redirect("/");
});
