// central place for persona-related api calls
// this keeps fetch logic out of layout and makes the code easier to scale later
import axios from "axios";
import type { Persona } from "../types/models"

// base url for the backend server
// later this can move to an envirnment variable
const API_BASE_URL = "http:localhost:4000/api/personas";

/*
Fetch all porsonas from the backend. 
this sends GET rtequests to the base url
*/

export async function getPersonas(): Promise<Persona[]> {
    const response = await axios.get(API_BASE_URL);

    // Axios automatically gives us the parsed JSON in response.data
    return response.data

}

/* Post create personas
*/
export async function createPersona(data: {
    name: string;
    niche: string;
    bio: string;
}): Promise<Persona> {
    const response = await axios.post(API_BASE_URL, data);
    return response.data
}