import { Router } from "express";
import { query } from "../lib/query";

const router = Router();

// GET /api/moments
router.get("/", async (_req, res) => {
  try {
    const result = await query(
      `
      SELECT
        id,
        persona_id AS "personaId",
        text,
        created_at AS "createdAt",
        likes,
        views
      FROM moments
      ORDER BY created_at DESC;
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching moments:", error);
    res.status(500).json({ message: "Failed to fetch moments" });
  }
});

// POST /api/moments
router.post("/", async (req, res) => {
  const { personaId, text } = req.body;

  if (!personaId || !text) {
    return res.status(400).json({
      message: "personaId and text are required",
    });
  }

  try {
    const result = await query(
      `
      INSERT INTO moments (persona_id, text, likes, views)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        persona_id AS "personaId",
        text,
        created_at AS "createdAt",
        likes,
        views;
      `,
      [personaId, text, 0, 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating moment:", error);
    res.status(500).json({ message: "Failed to create moment" });
  }
});

export default router;