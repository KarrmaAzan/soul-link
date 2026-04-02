import { Router } from "express";
import { query } from "../lib/query";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/requireAuth";

const router = Router();

/**
 * GET /api/personas/me
 * Private: only personas owned by the logged-in user
 */
router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await query(
      `
      SELECT
        id,
        name,
        niche,
        bio
      FROM personas
      WHERE user_id = $1
      ORDER BY id ASC
      `,
      [userId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching my personas:", error);
    return res.status(500).json({ message: "Failed to fetch personas" });
  }
});

/**
 * GET /api/personas/discover?q=
 * Public/discovery: lets authenticated users find other personas
 * Excludes the logged-in user's own personas
 */
router.get("/discover", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    const rawQ = String(req.query.q ?? "").trim();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const search = `%${rawQ.toLowerCase()}%`;

    const result = await query(
      `
      SELECT
        id,
        name,
        niche,
        bio
      FROM personas
      WHERE user_id <> $1
        AND (
          $2 = '%%'
          OR LOWER(name) LIKE $2
          OR LOWER(niche) LIKE $2
          OR LOWER(COALESCE(bio, '')) LIKE $2
        )
      ORDER BY name ASC
      LIMIT 25
      `,
      [userId, search]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error discovering personas:", error);
    return res.status(500).json({ message: "Failed to discover personas" });
  }
});

/**
 * POST /api/personas
 * Private: create persona for logged-in user
 */
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { name, niche, bio } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!name || !niche) {
    return res.status(400).json({
      message: "name and niche are required",
    });
  }

  try {
    const result = await query(
      `
      INSERT INTO personas (user_id, name, niche, bio)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        niche,
        bio
      `,
      [userId, name.trim(), niche.trim(), bio?.trim() ?? ""]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating persona:", error);
    return res.status(500).json({ message: "Failed to create persona" });
  }
});

export default router;