const crypto = require("crypto");

const secretKey = crypto.randomBytes(32).toString("hex"); // Generates a 32-byte secret key
console.log("Secret Key:", secretKey);

// DATABASE_URL=postgresql://username:password@localhost:5432/clubhouse
// SECRET=your_session_secret
