import axios from "axios";
import type { Persona } from "../types/models";
import { API_BASE_URL } from "../lib/api";

const API_URL = `${API_BASE_URL}/personas`;

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getMyPersonas(token: string): Promise<Persona[]> {
  const response = await axios.get(`${API_URL}/me`, authHeaders(token));
  return response.data;
}

export async function discoverPersonas(
  token: string,
  search = ""
): Promise<Persona[]> {
  const response = await axios.get(`${API_URL}/discover`, {
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
  const response = await axios.post(API_URL, data, authHeaders(token));
  return response.data;
}