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
- Ready for deployment on Vercel or any Node.js hosting platform

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/clubhouse.git
   cd clubhouse
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add your database and session secrets:

   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/clubhouse
   SESSION_SECRET=your_session_secret
   ```

4. **Set up the database:**

   - Create a PostgreSQL database named `clubhouse` (or as specified in your `.env`).
   - Run any migration scripts if provided.

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

## Tech Stack

- Node.js
- Express
- EJS
- Passport.js
- PostgreSQL
- bcryptjs
- express-session
- connect-flash

---

## License

ISC

---

##