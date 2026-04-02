import { Router } from "express";
import { query } from "../lib/query";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/requireAuth";

const router = Router();

// GET /api/messages/:conversationId?personaId=123
router.get("/:conversationId", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  const conversationId = Number(req.params.conversationId);
  const personaId = Number(req.query.personaId);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return res.status(400).json({ message: "Invalid conversation id" });
  }

  if (!Number.isInteger(personaId) || personaId <= 0) {
    return res.status(400).json({ message: "Valid personaId is required" });
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
      SELECT id
      FROM conversations
      WHERE id = $1
        AND (persona_one_id = $2 OR persona_two_id = $2)
      LIMIT 1
      `,
      [conversationId, personaId]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({
        message: "Forbidden: this persona does not belong to this conversation",
      });
    }

    const result = await query(
      `
      SELECT
        m.id,
        m.conversation_id AS "conversationId",
        m.sender_persona_id AS "senderPersonaId",
        m.text,
        m.created_at AS "createdAt"
      FROM messages m
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
      `,
      [conversationId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// POST /api/messages
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  const { conversationId, senderPersonaId, text } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!conversationId || !senderPersonaId || !text?.trim()) {
    return res.status(400).json({
      message: "conversationId, senderPersonaId, and text are required",
    });
  }

  try {
    const senderPersonaCheck = await query(
      `
      SELECT id
      FROM personas
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [senderPersonaId, userId]
    );

    if (senderPersonaCheck.rows.length === 0) {
      return res.status(403).json({
        message: "Forbidden: sender persona does not belong to this user",
      });
    }

    const conversationResult = await query(
      `
      SELECT
        id,
        persona_one_id,
        persona_two_id
      FROM conversations
      WHERE id = $1
      LIMIT 1
      `,
      [conversationId]
    );

    if (conversationResult.rows.length === 0) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const conversation = conversationResult.rows[0];

    const senderIsParticipant =
      Number(conversation.persona_one_id) === Number(senderPersonaId) ||
      Number(conversation.persona_two_id) === Number(senderPersonaId);

    if (!senderIsParticipant) {
      return res.status(403).json({
        message: "Forbidden: sender persona is not part of this conversation",
      });
    }

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
      [conversationId, senderPersonaId, text.trim()]
    );

    await query(
      `
      UPDATE conversations
      SET last_message = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [text.trim(), conversationId]
    );

    return res.status(201).json(messageResult.rows[0]);
  } catch (error: any) {
    console.error("Error creating message:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Conversation or sender persona does not exist",
      });
    }

    return res.status(500).json({ message: "Failed to create message" });
  }
});

export default router;