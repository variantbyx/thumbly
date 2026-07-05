import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import session from "express-session";
import { MongoStore } from "connect-mongo";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

await connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3000",
      "https://thumbly-tau.vercel.app",
    ],
    credentials: true,
  }),
);

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: "sessions",
    }),
  }),
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});
app.use("/uploads", express.static(uploadsDir));
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);
app.use("/api/user", UserRouter);

const port = process.env.PORT || 3000;

// Export the app for Vercel serverless compatibility
export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
