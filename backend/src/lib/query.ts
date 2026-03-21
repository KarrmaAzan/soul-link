import { pool } from "../config/db";

// Reusable helper for SGL queries
export const query = async (text: string, params: any[] =[]) => {
    return pool.query(text,params);
};