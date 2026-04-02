import axios from "axios";
import type { SoulLink } from "../types/models";
import { API_BASE_URL } from "../lib/api";

const API_URL = `${API_BASE_URL}/soul-links`;

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getSoulLinks(
  token: string,
  personaId: number
): Promise<SoulLink[]> {
  const res = await axios.get(API_URL, {
    ...authHeaders(token),
    params: { personaId },
  });
  return res.data;
}

export async function createSoulLink(
  token: string,
  data: {
    requesterPersonaId: number;
    recipientPersonaId: number;
  }
): Promise<SoulLink> {
  const res = await axios.post(API_URL, data, authHeaders(token));
  return res.data;
}

export async function acceptSoulLink(
  token: string,
  linkId: number,
  personaId: number
): Promise<SoulLink> {
  const res = await axios.patch(
    `${API_URL}/${linkId}/accept`,
    { personaId },
    authHeaders(token)
  );
  return res.data;
}