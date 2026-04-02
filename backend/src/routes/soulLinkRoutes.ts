import { Router } from "express";
import { query } from "../lib/query";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/requireAuth";

const router = Router();

// GET /api/soul-links?personaId=123
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
        sl.id,
        sl.requester_persona_id AS "requesterPersonaId",
        sl.recipient_persona_id AS "recipientPersonaId",
        sl.status,
        sl.created_at AS "createdAt"
      FROM soul_links sl
      WHERE sl.requester_persona_id = $1
         OR sl.recipient_persona_id = $1
      ORDER BY sl.created_at DESC
      `,
      [personaId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching soul links:", error);
    return res.status(500).json({ message: "Failed to fetch soul links" });
  }
});

// POST /api/soul-links
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  const { requesterPersonaId, recipientPersonaId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!requesterPersonaId || !recipientPersonaId) {
    return res.status(400).json({
      message: "requesterPersonaId and recipientPersonaId are required",
    });
  }

  if (Number(requesterPersonaId) === Number(recipientPersonaId)) {
    return res.status(400).json({
      message: "A persona cannot soul-link with itself",
    });
  }

  try {
    const requesterCheck = await query(
      `
      SELECT id
      FROM personas
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [requesterPersonaId, userId]
    );

    if (requesterCheck.rows.length === 0) {
      return res.status(403).json({
        message: "Forbidden: requester persona does not belong to this user",
      });
    }

    const recipientCheck = await query(
      `
      SELECT id
      FROM personas
      WHERE id = $1
      LIMIT 1
      `,
      [recipientPersonaId]
    );

    if (recipientCheck.rows.length === 0) {
      return res.status(400).json({
        message: "Recipient persona does not exist",
      });
    }

    const result = await query(
      `
      INSERT INTO soul_links (
        requester_persona_id,
        recipient_persona_id,
        status
      )
      VALUES ($1, $2, 'pending')
      RETURNING
        id,
        requester_persona_id AS "requesterPersonaId",
        recipient_persona_id AS "recipientPersonaId",
        status,
        created_at AS "createdAt"
      `,
      [requesterPersonaId, recipientPersonaId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating soul link:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Soul link already exists between these personas",
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        message: "One or both personas do not exist",
      });
    }

    return res.status(500).json({ message: "Failed to create soul link" });
  }
});

// PATCH /api/soul-links/:id/accept
router.patch("/:id/accept", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { personaId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!personaId) {
    return res.status(400).json({ message: "personaId is required" });
  }

  try {
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

    const accessCheck = await query(
      `
      SELECT sl.id
      FROM soul_links sl
      WHERE sl.id = $1
        AND sl.recipient_persona_id = $2
      LIMIT 1
      `,
      [id, personaId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({
        message: "Forbidden: this persona cannot accept this soul link",
      });
    }

    const result = await query(
      `
      UPDATE soul_links
      SET status = 'accepted'
      WHERE id = $1
      RETURNING
        id,
        requester_persona_id AS "requesterPersonaId",
        recipient_persona_id AS "recipientPersonaId",
        status,
        created_at AS "createdAt"
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Soul link not found",
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error accepting soul link:", error);
    return res.status(500).json({ message: "Failed to accept soul link" });
  }
});

export default router;