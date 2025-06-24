import bcrypt from "bcryptjs";
import pool from "./index.js";

async function seed() {
  try {
    // Clear existing data
    await pool.query("DELETE FROM messages");
    // await pool.query("DELETE FROM users");

    // // Create sample users
    // const password1 = await bcrypt.hash("password123", 10);
    // const password2 = await bcrypt.hash("securepass", 10);

    const userRes = await pool.query(
      `INSERT INTO users (username, email, password, is_member, created_at)
       VALUES 
        ($1, $2, $3, $4, NOW()),
        ($5, $6, $7, $8, NOW())
       RETURNING id`,
      [
        "alice",
        "alice@example.com",
        password1,
        true,
        "bob",
        "bob@example.com",
        password2,
        false,
      ]
    );

    const [aliceId, bobId] = userRes.rows.map((row) => row.id);

    // Create sample messages
    await pool.query(
      `INSERT INTO messages  (user_id, content, created_at)
       VALUES 
        ($1, $2, NOW()),
        ($3, $4, NOW())`,
      [
        aliceId,
        "Hello, this is Alice's first message!",
        bobId,
        "Hi, Bob here. Excited to join the club!",
      ]
    );

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
