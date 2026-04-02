import axios from "axios";

const API_URL = "http://localhost:4000/api/moments";

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getMoments(token: string, personaId: number) {
  const response = await axios.get(API_URL, {
    ...authHeaders(token),
    params: { personaId },
  });

  return response.data;
}

export async function createMoment(
  token: string,
  payload: { personaId: number; text: string }
) {
  const response = await axios.post(API_URL, payload, authHeaders(token));
  return response.data;
}