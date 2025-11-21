// import { NextResponse } from "next/server";
// import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
// import translate from "google-translate-api-x"; // ✅ added import
// import fs from "fs";
// import path from "path";
// import os from "os";

// // ✅ Initialize ElevenLabs client
// const elevenlabs = new ElevenLabsClient({
//   apiKey: process.env.ELEVENLABS_API_KEY,
// });

// export async function POST(request) {
//   try {
//     const data = await request.formData();
//     const file = data.get("file");

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // ✅ Save uploaded file temporarily
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const tempDir = os.tmpdir();
//     const filePath = path.join(tempDir, file.name);
//     fs.writeFileSync(filePath, buffer);

//     // ✅ Convert to readable Blob for ElevenLabs
//     const audioBlob = new Blob([buffer], { type: file.type || "audio/mp3" });

//     // ✅ Step 1: Transcribe with ElevenLabs
//     const transcription = await elevenlabs.speechToText.convert({
//       file: audioBlob,
//       modelId: "scribe_v1",
//       tagAudioEvents: true,
//       languageCode: null, // auto-detect language
//       diarize: true,
//     });

//     // ✅ Step 2: Convert Hindi text → Urdu while keeping English as-is
//     const convertToUrdu = async (text) => {
//       const response = await translate(text, { to: "en" });
//       return response.text;
//     };

//     const finalText = await convertToUrdu(transcription.text);

//     // ✅ Step 3: Delete temp file
//     fs.unlinkSync(filePath);

//     return NextResponse.json({ text: finalText });
//   } catch (error) {
//     console.error("Transcription Error:", error);
//     return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
//   }
// }










import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "50mb",   // Increase limit
  },
}

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert uploaded file into buffer (Vercel-safe)
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert buffer into WebFile (ElevenLabs accepts this)
    const audioFile = new File([buffer], file.name, {
      type: file.type || "audio/mpeg",
    });

    // Transcription
    const result = await elevenlabs.speechToText.convert({
      file: audioFile,
      modelId: "scribe_v1",
      diarize: false,
      tagAudioEvents: false,
    });

    return NextResponse.json({
      text: result.text || "No text found",
    });

  } catch (error) {
    console.error("Transcription Error:", error);
    return NextResponse.json(
      { error: "Transcription failed", details: error.message },
      { status: 500 }
    );
  }
}












