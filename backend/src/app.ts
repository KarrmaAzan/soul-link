import express from "express";
import cors from "cors";

import personaRoutes from "./routes/personaRoutes";
import momentRoutes from "./routes/momentRoutes";
import soulLinkRoutes from "./routes/soulLinkRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
].filter(Boolean) as string[];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Soul Link API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/moments", momentRoutes);
app.use("/api/soul-links", soulLinkRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

export default app;