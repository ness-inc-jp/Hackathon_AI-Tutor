import { useEffect, useState } from "react";

export const useTextToSpeech = () => {
  const [audioContext, setAudioContext] = useState<AudioContext>();

  useEffect(() => {
    if (typeof window !== "undefined" && !audioContext) {
      const audioContext = new AudioContext();
      setAudioContext(audioContext);
    }
  }, []);

  const getAudioUrl = async (text: string): Promise<string | null> => {
    if (!text || !audioContext) {
      return null;
    }

    const res = await fetch("/api/azure/textToSpeech", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const audioContent = data.audioContent as string;
    return `data:audio/mp3;base64,${audioContent}`;

    // const arrayBuffer = await res.arrayBuffer();
    // const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    // const source = audioContext.createBufferSource();
    // source.buffer = audioBuffer;
    // source.connect(audioContext.destination);
    // return source;
  };

  return {
    getAudioUrl,
  };
};
