import { SpeechConfig } from "microsoft-cognitiveservices-speech-sdk";

export const speechConfig = SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_SERVICE_KEY as string,
  process.env.AZURE_SPEECH_SERVICE_REGION as string,
);
