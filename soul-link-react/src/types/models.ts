// Shared app data models.
// These types are reused across multiple files so the whole app
// agrees on what a Moment, Persona, Conversation, and Message look like.



// A Moment is one post created by a specific persona.
// It appears in the home feed and also belongs in that personas sanctum

export type Moment = {
    id: number;

    // Persona that owns this moment
    personaId: number;

    // Display name shown in the UI
    author: string;

    // moments content
    text: string;

    // timestamp in which the moment was created
    createdAt: string;

    // placeholder for analytics for later stages
    likes: number;
    views: number;

};

export type Persona = {
    // unique id for each persona
    id: number;

    // display name for each persona
    name: string;

    // nniche or category of the persona
    niche: string;

    // short profile descriptiom
    bio: string;
};

// a SoulLink represents a friendship-style connection between two personas.
// for onw a soul link = friend request / accepted friend connection
export type SoulLink = {
  // unique id for the relationship
  id: number;

  // persona who sent the request
  requesterPersonaId: number;

  // persona receiving the request
  recipientPersonaId: number;

  // current state of the relationship
  status: "pending" | "accepted";

  // timestamp for when the request was created
  createdAt: string;
}

export type Conversation = {
    // unique id for the conversation thread
    id: number;

    // the personas involved in the conversation
    participantIds: number[];

    // basic preview text shown in the conversation list
    lastMessage: string;

    // timestamp for sorting/displaying
    updatedAt: string;
};

export type Message = {
    // unique id for the message itself
    id: number;

    // which conversation this message belongs to
    conversationId: number;

    // which persona sent the message
    senderPersonaId: number;

    // message body
    text: string;

    //timestamp
    createdAt: string;
};