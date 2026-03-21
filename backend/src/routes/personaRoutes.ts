import { Router } from "express";
import { query } from "../lib/query";

const router = Router();

// GET /api/personas
router.get("/", async (_req, res) => {
  try {
    const result = await query(
      "Select id, name, niche, bio FROM personas ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching personas:", error);
    res.status(500).json({ message: "Failed to fetch personas"});
  }
});

// POST /api/personas

router.post("/", async (req, res) => {
  const { name, niche, bio } = req.body;

  if (!name || !niche) {
    return res.status(400).json({
      message: "name and niche are required",
    })
  }

  try {
    const result = await query(
      `
      INSERT INTO personas (name, niche, bio)
      VALUEs ($1, $2, $3)
      RETURNING id, name, niche, bio
      `,
      [name, niche, bio ?? ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating persona:", error);
    res.status(500).json({ message: "Failed to create persona"})
  }
});

export default router;