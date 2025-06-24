# Clubhouse

A modern Node.js/Express membership club application featuring authentication, PostgreSQL integration, and EJS templating.

---

## 🚀 Features

- Secure user registration and login with hashed passwords (`bcryptjs`)
- Authentication using Passport.js (local strategy)
- Flash notifications for user feedback (`connect-flash`)
- Session management with `express-session`
- Robust form validation with `express-validator`
- PostgreSQL database integration (`pg`)
- Clean, server-side rendered UI with EJS
- Role-based access (admin/member)
- Ready for deployment on [Render](https://render.com/) or any Node.js platform

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/AleeyuDev/club-house-app.git
   cd clubhouse
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:

   ```
   DATABASE_URL=postgres://user:password@localhost:5432/clubhouse
   SESSION_SECRET=your_session_secret
   ```

4. **Set up the database:**
   - Create a PostgreSQL database as specified in your `.env`.
   - Run the provided migration scripts or use the following SQL to create tables:

     ```sql
     CREATE TABLE IF NOT EXISTS users (
       id SERIAL PRIMARY KEY,
       first_name VARCHAR(50) NOT NULL,
       last_name VARCHAR(50) NOT NULL,
       email VARCHAR(100) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       is_admin BOOLEAN DEFAULT FALSE,
       is_member BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE IF NOT EXISTS messages (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       content TEXT NOT NULL,
       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     ```

5. **Start the server:**

   ```sh
   npm run server
   ```

6. **(Optional) Start the client:**

   ```sh
   npm run client
   ```

---

## 📜 Scripts

- `npm run server` — Starts the Express server with Nodemon.
- `npm run client` — Starts the client app (if you have a frontend in `/client`).

---

## 🚢 Deployment

This app is ready for deployment on [Vercel](https://vercel.com/) or any Node.js hosting platform.  
Be sure to set your environment variables (`DATABASE_URL`, `SESSION_SECRET`) in your deployment dashboard.

---

## ⚙️ Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Secret for session encryption

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express
- **Authentication:** Passport.js, bcryptjs
- **Database:** PostgreSQL (`pg`)
- **Templating:** EJS
- **Session & Flash:** express-session, connect-flash
- **Validation:** express-validator

---

## 📄 License

[ISC](LICENSE)

---

## 👤 Author

Aliyu idris
