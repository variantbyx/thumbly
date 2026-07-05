import { Request, Response } from "express";
import { Thumbnail } from "../models/Thumbnail.js";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import ai from "../configs/ai.js";
import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const stylePrompts = {
  "Bold & Graphic":
    "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",
  "Tech/Futuristic":
    "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",
  Minimalist:
    "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",
  Photorealistic:
    "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",
  Illustrated:
    "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style",
};

const colorSchemeDescriptions = {
  vibrant:
    "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",
  sunset:
    "warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow",
  forest:
    "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",
  neon: "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",
  purple:
    "purple-dominant color palette, magenta and violet tones, modern and stylish mood",
  monochrome:
    "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",
  ocean:
    "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",
  pastel:
    "soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic",
};

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!title) return res.status(400).json({ message: "Title is required" });

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: user_prompt,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true,
    });

    const model = "gemini-3-pro-image-preview";

    const generationConfig: GenerateContentConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 0.95,
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: aspect_ratio || "16:9",
        imageSize: "1K",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF,
        },
      ],
    };

    let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]} for: "${title}". `;

    if (color_scheme) {
      prompt += `Use a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} color scheme. `;
    }

    if (user_prompt) {
      prompt += `Additional details: ${user_prompt}. `;
    }

    prompt +=
      "The thumbnail should be visually stunning, bold, professional, and designed to maximize click-through rate.";

    const fallbackImages = {
      "Bold & Graphic": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1024&q=80",
      "Tech/Futuristic": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1024&q=80",
      "Minimalist": "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=1024&q=80",
      "Photorealistic": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1024&q=80",
      "Illustrated": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1024&q=80",
    };

    let finalBuffer: Buffer | null = null;
    let fallbackUsed = false;

    try {
      const response: any = await ai.models.generateContent({
        model,
        contents: [prompt],
        config: generationConfig,
      });

      if (!response?.candidates?.[0]?.content?.parts) {
        throw new Error("Unexpected AI response");
      }

      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          finalBuffer = Buffer.from(part.inlineData.data, "base64");
        }
      }

      if (!finalBuffer) {
        throw new Error("Image buffer not generated by AI");
      }
    } catch (aiError: any) {
      console.warn("Gemini Image API failed. Attempting fallback placeholder...", aiError.message || aiError);
      
      const isQuotaError = 
        aiError.message?.includes("quota") || 
        aiError.message?.includes("RESOURCE_EXHAUSTED") || 
        aiError.message?.includes("limit: 0");

      if (isQuotaError) {
        const fallbackUrl = fallbackImages[style as keyof typeof fallbackImages] || fallbackImages["Bold & Graphic"];
        try {
          console.log(`Fetching style-matched fallback placeholder: ${fallbackUrl}`);
          const fetchRes = await fetch(fallbackUrl);
          if (!fetchRes.ok) throw new Error(`HTTP ${fetchRes.status}`);
          const arrayBuf = await fetchRes.arrayBuffer();
          finalBuffer = Buffer.from(arrayBuf);
          fallbackUsed = true;
        } catch (fetchError: any) {
          console.error("Fallback image fetching failed:", fetchError.message || fetchError);
          throw aiError; // Throw original AI error if fallback also fails
        }
      } else {
        throw aiError; // Throw original AI error if it's not a quota limit
      }
    }

    let imageUrl = "";

    const hasCloudinaryKeys = 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_KEY !== "your_cloudinary_api_key" &&
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name";

    if (hasCloudinaryKeys) {
      // Upload directly to Cloudinary (NO filesystem usage)
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", format: "png" },
            (
              error: UploadApiErrorResponse | undefined,
              result: UploadApiResponse | undefined,
            ) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error("Cloudinary upload failed"));
            },
          );
          stream.end(finalBuffer!);
        },
      );
      imageUrl = uploadResult.secure_url;
    } else {
      // Local storage fallback
      console.log("Cloudinary configuration not found or set to default. Saving thumbnail locally...");
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const localUploadsDir = path.join(__dirname, "../uploads");
      
      if (!fs.existsSync(localUploadsDir)) {
        fs.mkdirSync(localUploadsDir, { recursive: true });
      }

      const fileName = `${thumbnail._id}.png`;
      const filePath = path.join(localUploadsDir, fileName);
      await fs.promises.writeFile(filePath, finalBuffer!);
      
      const host = req.get("host") || "localhost:3000";
      // Determine protocol (e.g. check for reverse proxy headers)
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      imageUrl = `${protocol}://${host}/uploads/${fileName}`;
      console.log(`Saved locally. Served at: ${imageUrl}`);
    }

    thumbnail.image_url = imageUrl;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    return res.json({ 
      message: fallbackUsed 
        ? "Thumbnail Generated (Free tier Gemini Image quota exceeded: Style placeholder used)" 
        : "Thumbnail Generated", 
      thumbnail 
    });
  } catch (error: any) {
    console.error("Thumbnail Generation Error:", error);
    let errorMessage = error.message || "Internal Server Error";
    
    // Parse Google GenAI JSON-stringified error if present
    if (typeof errorMessage === "string" && errorMessage.startsWith("{")) {
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed.error?.message) {
          errorMessage = parsed.error.message;
        }
      } catch (e) {
        // Fallback to original message if parsing fails
      }
    }

    if (
      errorMessage.includes("API key not valid") || 
      errorMessage.includes("API_KEY_INVALID") ||
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY === "PLACEHOLDER_KEY"
    ) {
      errorMessage = "Invalid or missing Gemini API Key. Please add a valid GEMINI_API_KEY to your server/.env file.";
    }

    return res
      .status(500)
      .json({ message: errorMessage });
  }
};

// Delete Thumbnail
export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await Thumbnail.findOneAndDelete({ _id: id, userId });

    res.json({ message: "Thumbnail deleted successfully" });
  } catch (error: any) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message });
  }
};
