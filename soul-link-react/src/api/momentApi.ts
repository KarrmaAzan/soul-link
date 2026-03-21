import axios from "axios";
import type { Moment } from "../types/models";

const API_URL = "http://localhost:4000/api/moments";

export async function getMoments(): Promise<Moment[]> {
    const res = await axios.get(API_URL);
    return res.data;
}

export async function createMoment(data: {
    personaId: number;
    text: string;
}): Promise<Moment> {
    const res = await axios.post(API_URL, data);
    return res.data;
}