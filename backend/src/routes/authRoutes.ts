import express from "express";
import bcrypt from "bcrypt";
import { query } from "../lib/query";
import {
  checkUsernameSchema,
  loginSchema,
  registerSchema,
} from "../validators/authSchemas";
import { signToken } from "../utils/jwt";
import { requireAuth, type AuthenticatedRequest } from "../middleware/requireAuth";

// express router
const router = express.Router();


// GET testing auth routes
router.get("/test", (_req, res) => {
  res.json({ message: "auth routes working" });
});

// checking if there is a username within the database that exists
router.post("/check-username", async (req, res) => {
  try {
    const parsed = checkUsernameSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const username = parsed.data.username.toLowerCase();

    const result = await query(
      `SELECT id FROM users WHERE LOWER(username) = $1 LIMIT 1`,
      [username]
    );

    return res.json({ available: result.rows.length === 0 });
  } catch (error) {
    console.error("USERNAME CHECK ERROR:", error)
    return res.status(500).json({ message: "Failed to check username" });
  }
});


// registration route
router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid registration data" });
    }

    const firstName = parsed.data.firstName.trim();
    const lastName = parsed.data.lastName.trim();
    const username = parsed.data.username.trim().toLowerCase();
    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const dbMeta = await query(`
  SELECT current_database() as db, current_schema() as schema
`);
console.log("DB META:", dbMeta.rows[0]);

const usersMeta = await query(`
  SELECT table_schema, table_name
  FROM information_schema.tables
  WHERE table_name = 'users'
`);
console.log("USERS META:", usersMeta.rows);

    const existingUsername = await query(
      `SELECT id FROM users WHERE LOWER(username) = $1 LIMIT 1`,
      [username]
    );

    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const existingEmail = await query(
      `SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1`,
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `
      INSERT INTO users (first_name, last_name, username, email, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, username, email
      `,
      [firstName, lastName, username, email, passwordHash]
    );

    const user = result.rows[0];

    const token = signToken({
      userId: user.id,
      username: user.username,
    });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR FULL:", {
  message: error instanceof Error ? error.message : error,
  stack: error instanceof Error ? error.stack : null,
});4
   return res.status(500).json({
  message: "Registration failed",
  error: error instanceof Error ? error.message : error,
});
  }
});


// Login route
router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid login data" });
    }

    const identifier = parsed.data.identifier.trim().toLowerCase();
    const password = parsed.data.password;

    const result = await query(
      `
      SELECT id, first_name, last_name, username, email, password_hash
      FROM users
      WHERE LOWER(email) = $1 OR LOWER(username) = $1
      LIMIT 1
      `,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    return res.status(500).json({ message: "Login failed" });
  }
});


// User route
router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;

    const userResult = await query(
      `
      SELECT id, first_name, last_name, username, email
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const personaResult = await query(
      `
      SELECT id, name, niche, bio
      FROM personas
      WHERE user_id = $1
      ORDER BY id ASC
      `,
      [userId]
    );

    const personas = personaResult.rows;

    return res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      personas,
      hasPersona: personas.length > 0,
    });
  } catch (error) {
    console.error("ME ERROR:", error);
    return res.status(500).json({ message: "Failed to load user" });
  }
});
export default router;