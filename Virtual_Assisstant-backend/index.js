import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import authRouter from "./route/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./route/user_route.js";
import geminiResponse from "./gemini.js";
import { detectTone } from "./detectTone.js";

const app = express();
const port = process.env.PORT 

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/auth/user", userRouter);

connectDb();


app.get("/health", (req, res) => {
  res.send("ok");
});


app.get("/", (req, res) => {
  res.send("HIIIII");
});

/**
 * 🔥 FINAL AI ENDPOINT
 * Flow:
 * text → Gemini
 * voice.wav → Python tone detect
 * merge emotion
 */
app.post("/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    // 1️⃣ Gemini response (text + emotion)
    const geminiRaw = await geminiResponse(prompt);
    const geminiData = JSON.parse(geminiRaw);

    // 2️⃣ Detect voice tone (from Python)
    let toneData = null;
    try {
      toneData = await detectTone("voice.wav");
    } catch (e) {
      console.log("Tone detection failed, using Gemini emotion");
    }

    // 3️⃣ Final emotion logic
    let finalEmotion = geminiData.emotion;

    if (toneData?.emotion) {
      // Voice ko zyada priority
      finalEmotion = toneData.emotion;
    }

    // 4️⃣ Final response
    res.json({
      ...geminiData,
      finalEmotion,
      toneAnalysis: toneData || null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI processing failed"
    });
  }
});

app.listen(port, () => {
  console.log("Server Created Successfully on port", port);
});
