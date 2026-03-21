// these backend models mirror the frontend models
// later, these shapes will mao to database tables

export type Persona = {
 id: number;
 name: string;
 niche: string;
 bio: string;
};

export type Moment = {
    id: number;
    personaId: number;
    author: string;
    text: string;
    createdAt: string;
    likes: number;
    views: number;
};


export type SoulLink = {
    id: number;
    requesterPersonaId: number;
    recipientPersonaId: number;
    status: "pending" | "accepted";
    createdAt: string;
};

export type Conversation = {
    id: number;
    participantIds: number[];
    lastMessage: string;
    updatedAt: string;
};

export type Message = {
    id: number,
    conversationId: number;
    senderPersonaId: number;
    text: string;
    createdAt: string;
};