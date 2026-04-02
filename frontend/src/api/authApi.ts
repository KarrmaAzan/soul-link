import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function getMe(token: string) {
  const { data } = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}