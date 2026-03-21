// In-memory data store
// for stage 6, this acts like a fake database
// in stage 7, these arrays will be replaced by postgresSQL tables

import type {
    Persona, 
    Moment,
    SoulLink,
    Conversation,
    Message,
} from "../types/models";

export const personas: Persona[] = [];
export const moments: Moment[] =[];
export const soulLinks: SoulLink[] = [];
export const conversations: Conversation[] = [];
export const messages: Message[] = [];