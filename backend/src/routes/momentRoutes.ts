import { Router } from "express";
import { query } from "../lib/query";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/requireAuth";

const router = Router();

// GET /api/moments?personaId=123
router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    const personaId = Number(req.query.personaId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Number.isInteger(personaId) || personaId <= 0) {
      return res.status(400).json({ message: "Valid personaId is required" });
    }

    const personaCheck = await query(
      `
      SELECT id
      FROM personas
      WHERE id = $1 AND user_id = $2
      LIMIT 1
      `,
      [personaId, userId]
    );

    if (personaCheck.rows.length === 0) {
      return res.status(403).json({
        message: "Forbidden: persona does not belong to this user",
      });
    }

    const result = await query(
      `
      SELECT
        m.id,
        m.persona_id AS "personaId",
        p.name AS "personaName",
        m.text,
        m.likes,
        m.views,
        m.created_at AS "createdAt"
      FROM moments m
      INNER JOIN personas p
        ON p.id = m.persona_id
      WHERE m.persona_id = $1
      ORDER BY m.created_at DESC
      `,
      [personaId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching moments:", error);
    return res.status(500).json({ message: "Failed to fetch moments" });
  }
});

// POST /api/moments
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    const { personaId, text } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!personaId || !text?.trim()) {
      return res.status(400).json({
        message: "personaId and text are required",
      });
    }

    const personaCheck = await query(
      `
      SELECT id, name
      FROM personas
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [personaId, userId]
    );

    if (personaCheck.rows.length === 0) {
      return res.status(403).json({
        message: "Forbidden: persona does not belong to this user",
      });
    }

    const persona = personaCheck.rows[0];

    const result = await query(
      `
      INSERT INTO moments (persona_id, text)
      VALUES ($1, $2)
      RETURNING
        id,
        persona_id AS "personaId",
        text,
        likes,
        views,
        created_at AS "createdAt"
      `,
      [personaId, text.trim()]
    );

    return res.status(201).json({
      ...result.rows[0],
      personaName: persona.name,
    });
  } catch (error) {
    console.error("Error creating moment:", error);
    return res.status(500).json({ message: "Failed to create moment" });
  }
});

export default router;