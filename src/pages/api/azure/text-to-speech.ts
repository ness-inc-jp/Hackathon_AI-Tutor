import { AudioConfig, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { speechConfig } from "@/src/utils/azure";

speechConfig.speechSynthesisVoiceName = "en-US-AmberNeural";

// AudioConfig
const audioConfig = AudioConfig.fromDefaultSpeakerOutput();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

  try {
    const result = await new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          synthesizer.close();
          resolve(result);
        },
        (error) => {
          synthesizer.close();
          reject(error);
        },
      );
    });

    const audioBuffer = Buffer.from((result as any).audioData);
    const audioContent = audioBuffer.toString("base64");
    res.status(200).json({ audioContent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
