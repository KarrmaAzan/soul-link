import axios from "axios";
import type { Message } from "../types/models";

const API_URL = "http://localhost:4000/api/messages";

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getMessagesByConversation(
  token: string,
  conversationId: number,
  personaId: number
): Promise<Message[]> {
  const res = await axios.get(`${API_URL}/${conversationId}`, {
    ...authHeaders(token),
    params: { personaId },
  });
  return res.data;
}

export async function createMessage(
  token: string,
  data: {
    conversationId: number;
    senderPersonaId: number;
    text: string;
  }
): Promise<Message> {
  const res = await axios.post(API_URL, data, authHeaders(token));
  return res.data;
}