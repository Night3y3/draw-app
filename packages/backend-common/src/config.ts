import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_KEY = process.env.REDIS_KEY;
