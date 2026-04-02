import { pool } from "../config/db";

export const query = async (text: string, params: any[] = []) => {
  return pool.query(text, params);
};