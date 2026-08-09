import type { Conversation, Message, Moment, Persona, SoulLink } from "./types/models";

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const demoPersonas: Persona[] = [
  { id: 101, name: "Karrma Creates", niche: "Music & visual worlds", bio: "Building sound, stories, and visual language for people who feel everything deeply." },
  { id: 102, name: "Azan Within", niche: "Reflection & growth", bio: "A quieter space for honest thought, spiritual practice, and becoming." },
  { id: 103, name: "Night Shift", niche: "Ideas after midnight", bio: "Loose concepts, experiments, and the things that only make sense at 2AM." },
  { id: 104, name: "Maya Sol", niche: "Movement & wellness", bio: "Finding softness, strength, and a little sunlight in every day." },
  { id: 105, name: "Omari West", niche: "Film & culture", bio: "Frames, conversations, and culture through a patient lens." },
];

export const demoUser = {
  id: 9001,
  firstName: "Karrma",
  lastName: "Azan",
  username: "karrmaazan",
  email: "demo@soullink.local",
  personas: demoPersonas,
  hasPersona: true,
};

export const demoMoments: Moment[] = [
  { id: 501, personaId: 101, personaName: "Karrma Creates", text: "Some ideas don’t arrive as words. They arrive as color, tension, and a rhythm you can almost touch.", createdAt: "2026-08-08T20:12:00.000Z", likes: 28, views: 146 },
  { id: 502, personaId: 101, personaName: "Karrma Creates", text: "Making the thing before I fully understand it. Trusting that clarity sometimes comes after the work.", createdAt: "2026-08-07T06:42:00.000Z", likes: 41, views: 219 },
  { id: 503, personaId: 102, personaName: "Azan Within", text: "Peace isn’t the absence of movement. Sometimes it is choosing what deserves to move you.", createdAt: "2026-08-06T18:05:00.000Z", likes: 19, views: 88 },
];

export const demoSoulLinks: SoulLink[] = [
  { id: 601, requesterPersonaId: 101, recipientPersonaId: 104, status: "accepted", createdAt: "2026-08-04T17:00:00.000Z" },
  { id: 602, requesterPersonaId: 105, recipientPersonaId: 101, status: "pending", createdAt: "2026-08-08T16:20:00.000Z" },
];

export const demoConversations: Conversation[] = [
  { id: 701, participantIds: [101, 104], lastMessage: "That world feels completely yours.", updatedAt: "2026-08-08T21:31:00.000Z" },
  { id: 702, participantIds: [101, 105], lastMessage: "Send me the rough cut when it’s ready.", updatedAt: "2026-08-07T19:12:00.000Z" },
];

export const demoMessages: Message[] = [
  { id: 801, conversationId: 701, senderPersonaId: 104, text: "I listened to the new piece twice this morning.", createdAt: "2026-08-08T21:22:00.000Z" },
  { id: 802, conversationId: 701, senderPersonaId: 101, text: "That means a lot. I wanted it to feel like remembering a place you’ve never been.", createdAt: "2026-08-08T21:27:00.000Z" },
  { id: 803, conversationId: 701, senderPersonaId: 104, text: "That world feels completely yours.", createdAt: "2026-08-08T21:31:00.000Z" },
];
