import axios from "axios";
import type { Message } from "../types/models";

const API_URL = "http://localhost:4000/api/messages";

export async function getMessagesByConversation(
    conversationId: number
): Promise<Message[]> {
    const res = await axios.get(`${API_URL}/conversations/${conversationId}`);
    return res.data
}

export async function createMessage(data: {
    conversationId: number;
    senderPersonaId: number;
    text: string;
}): Promise<Message> {
    const res = await axios.post(API_URL, data);
    return res.data;
}

