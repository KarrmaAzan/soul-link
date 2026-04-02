import { Router } from "express";
import { query } from "../lib/query";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/requireAuth";

const router = Router();

// GET /api/conversations?personaId=123
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
        c.id,
        ARRAY[c.persona_one_id, c.persona_two_id] AS "participantIds",
        c.last_message AS "lastMessage",
        c.updated_at AS "updatedAt"
      FROM conversations c
      WHERE c.persona_one_id = $1
         OR c.persona_two_id = $1
      ORDER BY c.updated_at DESC
      `,
      [personaId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

// POST /api/conversations
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  const { participantIds, lastMessage } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!participantIds || !Array.isArray(participantIds) || participantIds.length !== 2) {
    return res.status(400).json({
      message: "participantIds must be an array of exactly 2 persona IDs",
    });
  }

  const [firstIdRaw, secondIdRaw] = participantIds;
  const firstId = Number(firstIdRaw);
  const secondId = Number(secondIdRaw);

  if (!Number.isInteger(firstId) || !Number.isInteger(secondId)) {
    return res.status(400).json({
      message: "participantIds must contain valid numeric persona IDs",
    });
  }

  if (firstId === secondId) {
    return res.status(400).json({
      message: "A conversation cannot have the same persona twice",
    });
  }

  const personaOneId = Math.min(firstId, secondId);
  const personaTwoId = Math.max(firstId, secondId);

  try {
    const ownershipCheck = await query(
      `
      SELECT id
      FROM personas
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [firstId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({
        message: "Forbidden: initiating persona does not belong to this user",
      });
    }

    const personaExistenceCheck = await query(
      `
      SELECT id
      FROM personas
      WHERE id IN ($1, $2)
      `,
      [personaOneId, personaTwoId]
    );

    if (personaExistenceCheck.rows.length !== 2) {
      return res.status(400).json({
        message: "One or both personas do not exist",
      });
    }

    const existing = await query(
      `
      SELECT
        id,
        ARRAY[persona_one_id, persona_two_id] AS "participantIds",
        last_message AS "lastMessage",
        updated_at AS "updatedAt"
      FROM conversations
      WHERE persona_one_id = $1
        AND persona_two_id = $2
      LIMIT 1
      `,
      [personaOneId, personaTwoId]
    );

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    const result = await query(
      `
      INSERT INTO conversations (
        persona_one_id,
        persona_two_id,
        last_message,
        updated_at
      )
      VALUES ($1, $2, $3, NOW())
      RETURNING
        id,
        ARRAY[persona_one_id, persona_two_id] AS "participantIds",
        last_message AS "lastMessage",
        updated_at AS "updatedAt"
      `,
      [personaOneId, personaTwoId, lastMessage ?? ""]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating conversation:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Conversation already exists between these personas",
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        message: "One or both personas do not exist",
      });
    }

    return res.status(500).json({ message: "Failed to create conversation" });
  }
});

export default router;