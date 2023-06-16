import { useEffect, useState } from "react";

export const useAudio = () => {
  const [audio, setAudio] = useState<HTMLAudioElement>();

  useEffect(() => {
    if (typeof window !== "undefined" && !audio) {
      const audio = new Audio();
      setAudio(audio);
    }
  }, []);

  const playAudio = async (src: string) => {
    if (!src || !audio) {
      return;
    }

    audio.src = src;
    audio.play();
  };

  return {
    playAudio,
  };
};
