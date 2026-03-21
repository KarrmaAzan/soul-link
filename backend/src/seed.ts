import "dotenv/config";
import { query } from "./lib/query";

const seed = async () => {
  try {
    console.log("🌱 Starting seed...");

    // Clear tables in child-to-parent order because of foreign keys
    await query(`DELETE FROM messages;`);
    await query(`DELETE FROM conversations;`);
    await query(`DELETE FROM soul_links;`);
    await query(`DELETE FROM moments;`);
    await query(`DELETE FROM personas;`);

    // Reset IDs so the demo data is predictable
    await query(`ALTER SEQUENCE messages_id_seq RESTART WITH 1;`);
    await query(`ALTER SEQUENCE conversations_id_seq RESTART WITH 1;`);
    await query(`ALTER SEQUENCE soul_links_id_seq RESTART WITH 1;`);
    await query(`ALTER SEQUENCE moments_id_seq RESTART WITH 1;`);
    await query(`ALTER SEQUENCE personas_id_seq RESTART WITH 1;`);

    // -----------------------------
    // 1) Seed personas
    // -----------------------------
    const personasResult = await query(
      `
      INSERT INTO personas (name, niche, bio)
      VALUES
        ('Karrma', 'Alchemy', 'Infinite Love'),
        ('Nuri', 'Hope', 'Second chance')
      RETURNING id, name;
      `
    );

    const karrma = personasResult.rows.find((p) => p.name === "Karrma");
    const nuri = personasResult.rows.find((p) => p.name === "Nuri");

    if (!karrma || !nuri) {
      throw new Error("Failed to seed personas");
    }

    // -----------------------------
    // 2) Seed moments
    // -----------------------------
    await query(
      `
      INSERT INTO moments (persona_id, text, likes, views)
      VALUES
        ($1, 'The alchemical path begins here.', 12, 104),
        ($1, 'Infinite love is the source.', 25, 210),
        ($2, 'Hope is what gives the heart a second chance.', 8, 76),
        ($2, 'Learning to live again, one step at a time.', 14, 132);
      `,
      [karrma.id, nuri.id]
    );

    // -----------------------------
    // 3) Seed soul link
    // -----------------------------
    await query(
      `
      INSERT INTO soul_links (
        requester_persona_id,
        recipient_persona_id,
        status
      )
      VALUES ($1, $2, 'accepted');
      `,
      [karrma.id, nuri.id]
    );

    // -----------------------------
    // 4) Seed conversation
    // -----------------------------
    const conversationResult = await query(
      `
      INSERT INTO conversations (
        persona_one_id,
        persona_two_id,
        last_message,
        updated_at
      )
      VALUES ($1, $2, 'I know. We keep moving.', NOW())
      RETURNING id;
      `,
      [Math.min(karrma.id, nuri.id), Math.max(karrma.id, nuri.id)]
    );

    const conversationId = conversationResult.rows[0]?.id;

    if (!conversationId) {
      throw new Error("Failed to seed conversation");
    }

    // -----------------------------
    // 5) Seed messages
    // -----------------------------
    await query(
      `
      INSERT INTO messages (
        conversation_id,
        sender_persona_id,
        text
      )
      VALUES
        ($1, $2, 'You still believe?'),
        ($1, $3, 'I do. Even after everything.'),
        ($1, $2, 'That kind of hope is rare.'),
        ($1, $3, 'I know. We keep moving.');
      `,
      [conversationId, karrma.id, nuri.id]
    );

    console.log("✅ Full seed complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Full seed failed:", error);
    process.exit(1);
  }
};

seed();