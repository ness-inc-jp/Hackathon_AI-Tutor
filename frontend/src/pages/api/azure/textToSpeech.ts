import {
  SpeechConfig,
  AudioConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = JSON.parse(req.body);

  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const speechConfig = SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_SERVICE_KEY as string,
    process.env.AZURE_SPEECH_SERVICE_REGION as string,
  );

  const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

  synthesizer.speakTextAsync(
    text,
    async (result) => {
      synthesizer.close();

      const audioBuffer = Buffer.from(result.audioData);
      const audioContent = audioBuffer.toString("base64");
      res.status(200).json({ audioContent });
    },
    (error) => {
      synthesizer.close();
      console.log(error);
      res.status(500).json({ error });
    },
  );
}
