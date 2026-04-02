import axios from "axios";
import type { Persona } from "../types/models";

const API_BASE_URL = "http://localhost:4000/api/personas";

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getMyPersonas(token: string): Promise<Persona[]> {
  const response = await axios.get(`${API_BASE_URL}/me`, authHeaders(token));
  return response.data;
}

export async function discoverPersonas(
  token: string,
  search = ""
): Promise<Persona[]> {
  const response = await axios.get(`${API_BASE_URL}/discover`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: search,
    },
  });

  return response.data;
}

export async function createPersona(
  token: string,
  data: {
    name: string;
    niche: string;
    bio: string;
  }
): Promise<Persona> {
  const response = await axios.post(API_BASE_URL, data, authHeaders(token));
  return response.data;
}