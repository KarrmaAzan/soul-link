import express from "express";
import cors from "cors";


import personaRoutes from "./routes/personaRoutes";
import momentRoutes from "./routes/momentRoutes";
import soulLinkRoutes from "./routes/soulLinkRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

// allow frontend requests from another port during development
app.use(cors());

// parse json request bodies
app.use(express.json());

// health check route
app.get("/", (_req, res) => {
    res.json({ message: "Soul Link API is running"});
});

    // resource routes
    app.use("/api/auth", authRoutes)
    app.use("/api/personas", personaRoutes);
    app.use("/api/moments", momentRoutes);
    app.use("/api/soul-links", soulLinkRoutes);
    app.use("/api/conversations", conversationRoutes);
    app.use("/api/messages", messageRoutes);

    export default app;