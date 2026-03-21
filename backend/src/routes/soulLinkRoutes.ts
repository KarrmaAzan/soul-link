import { Router } from "express";
import { query } from "../lib/query";

const router = Router();

// GET /api/soul-Links

router.get("/", async (_req, res) => {
    try {
        const result = await query(
            ` 
            SELECT
            id,
            requester_persona_id AS "requesterPersonaId",
            recipient_persona_id AS "recipientPersonaId",
            status,
            created_at AS "createdAt"
            FROM soul_links
            ORDER BY created_at DESC;
            `
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching soul links:", error);
        res.status(500).json({ message: "Failed to fetch soul links"})
    }
});


// POST /api/soulLinks
router.post("/", async (req, res) => {
  const { requesterPersonaId, recipientPersonaId } = req.body;

  if (!requesterPersonaId || !recipientPersonaId) {
    return res.status(400).json({
      message: "requesterPersonaId and recipientPersonaId are required",
    });
  }

  if (requesterPersonaId === recipientPersonaId) {
    return res.status(400).json({
      message: "A persona cannot soul-link with itself",
    });
  }

  try {
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
        created_at AS "createdAt";
      `,
      [requesterPersonaId, recipientPersonaId]
    );

    res.status(201).json(result.rows[0]);
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

    res.status(500).json({ message: "Failed to create soul link" });
  }
});


// PATCH /api/soul-links/:id/accept

router.patch("/:id/accept", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      `
      UPDATE soul_links
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        requester_persona_id AS "requesterPersonaId",
        recipient_persona_id AS "recipientPersonaId",
        status,
        created_at AS "createdAt"
      `,
      ["accepted", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Soul link not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error accepting soul link:", error);
    res.status(500).json({ message: "Failed to accept soul link" });
  }
});

export default router;