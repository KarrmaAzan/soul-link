import { Router } from "express";
import { query } from "../lib/query";

const router = Router();

// GET /api/conversations
router.get("/", async (_req, res) => {
  try {
    const result = await query(
      `
      SELECT
        id,
        ARRAY[persona_one_id, persona_two_id] AS "participantIds",
        last_message AS "lastMessage",
        updated_at AS "updatedAt"
      FROM conversations
      ORDER BY updated_at DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

// POST /api/conversations
router.post("/", async (req, res) => {
  const { participantIds, lastMessage } = req.body;

  if (!participantIds || !Array.isArray(participantIds) || participantIds.length !== 2) {
    return res.status(400).json({
      message: "participantIds must be an array of exactly 2 persona IDs",
    });
  }

  const [firstId, secondId] = participantIds;

  if (firstId === secondId) {
    return res.status(400).json({
      message: "A conversation cannot have the same persona twice",
    });
  }

  const personaOneId = Math.min(firstId, secondId);
  const personaTwoId = Math.max(firstId, secondId);

  try {
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

    res.status(201).json(result.rows[0]);
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

    res.status(500).json({ message: "Failed to create conversation" });
  }
});

export default router;