import { useEffect, useState } from "react";

interface Props {
  onAudioStart?: () => void;
  onAudioEnded?: () => void;
}

export const useAudio = (props: Props) => {
  const { onAudioStart, onAudioEnded } = props;
  const [audio, setAudio] = useState<HTMLAudioElement>();

  useEffect(() => {
    if (typeof window !== "undefined" && !audio) {
      const audio = new Audio();

      if (onAudioEnded) {
        audio.onended = onAudioEnded;
      }

      setAudio(audio);
    }
  }, [audio, onAudioEnded]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.onended = null;
      }
    };
  }, [audio]);

  const playAudio = async (src: string) => {
    if (!src || !audio) {
      return;
    }

    if (onAudioStart) {
      onAudioStart();
    }

    audio.src = src;
    audio.play();
  };

  return {
    playAudio,
  };
};
