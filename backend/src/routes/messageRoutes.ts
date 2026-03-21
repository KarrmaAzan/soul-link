import { Router } from "express";
import { query } from "../lib/query";

const router = Router();

// GET /api/messages/conversation/:id
router.get("/conversation/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      `
      SELECT
        id,
        conversation_id AS "conversationId",
        sender_persona_id AS "senderPersonaId",
        text,
        created_at AS "createdAt"
      FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// POST /api/messages
router.post("/", async (req, res) => {
  const { conversationId, senderPersonaId, text } = req.body;

  if (!conversationId || !senderPersonaId || !text) {
    return res.status(400).json({
      message: "conversationId, senderPersonaId, and text are required",
    });
  }

  try {
    const messageResult = await query(
      `
      INSERT INTO messages (
        conversation_id,
        sender_persona_id,
        text
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        conversation_id AS "conversationId",
        sender_persona_id AS "senderPersonaId",
        text,
        created_at AS "createdAt"
      `,
      [conversationId, senderPersonaId, text]
    );

    await query(
      `
      UPDATE conversations
      SET last_message = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [text, conversationId]
    );

    res.status(201).json(messageResult.rows[0]);
  } catch (error: any) {
    console.error("Error creating message:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Conversation or sender persona does not exist",
      });
    }

    res.status(500).json({ message: "Failed to create message" });
  }
});

export default router;