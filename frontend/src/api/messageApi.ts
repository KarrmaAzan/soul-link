import axios from "axios";
import type { Message } from "../types/models";
import { API_BASE_URL } from "../lib/api";

const API_URL = `${API_BASE_URL}/messages`;

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