import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import session from "express-session";
import { MongoStore } from "connect-mongo";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import ContactRouter from "./routes/ContactRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

declare module "express-session" {
  interface SessionData {
    isLoggedIn: boolean;
    userId: string;
  }
}

// Initialize primary database connection
await connectDB();

const app = express();

// Trust proxy for secure cookies behind reverse proxies (Vercel, Render, Nginx)
app.set("trust proxy", 1);

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// General Rate Limiter (Protects against DDoS / brute force)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
});
app.use("/api/", globalLimiter);

// Specific Rate Limiter for Generation & Auth
const generationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 thumbnail generations per 15 minutes
  message: { message: "Thumbnail generation rate limit reached. Please wait a few minutes before trying again." },
});
app.use("/api/thumbnail/generate", generationLimiter);

// Dynamic Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://thumbly-tau.vercel.app",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // Automatically allow preview deployments
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow to avoid CORS block on production misconfigs
    },
    credentials: true,
  })
);

// Serverless DB Re-connection Middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error("Database connection middleware error:", err);
    }
  }
  next();
});

// Session Management
app.use(
  session({
    secret: (process.env.SESSION_SECRET as string) || "thumbly_default_secret_key_change_in_prod",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    },
    store: MongoStore.create({
      mongoUrl: (process.env.MONGODB_URI as string) || "mongodb://127.0.0.1:27017/thumbly",
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7,
    }),
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploaded files
app.use("/uploads", express.static(uploadsDir));

// Health & Status Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Thumbly API",
    status: "online",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);
app.use("/api/user", UserRouter);
app.use("/api/contact", ContactRouter);

const port = process.env.PORT || 3000;

// Export app for Vercel serverless functions
export default app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
