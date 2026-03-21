import axios from "axios";

import type { SoulLink } from "../types/models";;

const API_URL = "http://localhost:4000/api/soul-links";

export async function getSoulLinks(): Promise<SoulLink[]> {
    const res = await axios.get(API_URL);
    return res.data;
}


export async function createSoulLink(data: {
    requesterPersonaId: number;
    recipientPersonaId: number;
}): Promise<SoulLink> {
    const res = await axios.post(API_URL, data);
    return res.data;
}

export async function acceptSoulLink(linkId: number): Promise<SoulLink> {
    const res = await axios.patch(`${API_URL}/${linkId}/accept`);
    return res.data

}