import axios from "axios";
import type { Conversation } from "../types/models";
import { API_BASE_URL } from "../lib/api";

const API_URL = `${API_BASE_URL}/conversations`;

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getConversations(
  token: string,
  personaId: number
): Promise<Conversation[]> {
  const res = await axios.get(API_URL, {
    ...authHeaders(token),
    params: { personaId },
  });
  return res.data;
}

export async function createConversation(
  token: string,
  data: {
    participantIds: number[];
  }
): Promise<Conversation> {
  const res = await axios.post(API_URL, data, authHeaders(token));
  return res.data;
}