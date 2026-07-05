import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to this config file's location to avoid Cwd path dependency
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "PLACEHOLDER_KEY",
});

export default ai;
