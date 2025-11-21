import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,        // required for file upload
    sizeLimit: "50mb",        // required to avoid 413 error
  },
};

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const form = new formidable.IncomingForm({
      multiples: false,
      uploadDir: "/tmp",
      keepExtensions: true,
    });

    // Parse uploaded file
    const file = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve(files.file);
      });
    });

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Read file
    const audioBuffer = fs.readFileSync(file.filepath);
    const audioBlob = new Blob([audioBuffer], { type: file.mimetype });

    // Transcribe
    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1",
    });

    // Delete temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({ text: transcription.text });
  } catch (err) {
    console.error("Transcription Error:", err);
    return res.status(500).json({ error: "Transcription failed" });
  }
}
