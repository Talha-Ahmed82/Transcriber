import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import fs from "fs";
import path from "path";
import os from "os";

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY, // stored in your .env
});

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save the uploaded file temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Convert to readable Blob for ElevenLabs SDK
    const audioBlob = new Blob([buffer], { type: file.type || "audio/mp3" });

    // Transcribe with ElevenLabs
    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1",
      tagAudioEvents: true,
      languageCode: "eng",
      diarize: true,
    });

    // Delete file
    fs.unlinkSync(filePath);

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription Error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
