import axios from "axios";
import type { Conversation } from "../types/models";

const API_URL = "http://localhost:4000/api/conversations";

export async function getConversations(): Promise<Conversation[]> {
    const res = await axios.get(API_URL);
    return res.data
}

export async function createConversation(data: {
    participantIds: number[];
}): Promise<Conversation> {
    const res = await axios.post(API_URL, data);
    return res.data
}