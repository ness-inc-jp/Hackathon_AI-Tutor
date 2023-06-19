import axios, { AxiosRequestConfig } from "axios";

export const useTextToSpeech = () => {
  const getAudioUrl = async (text: string): Promise<string | null> => {
    if (!text) {
      return null;
    }

    const requestConfig: AxiosRequestConfig = {
      method: "POST",
      url: "/api/azure/text-to-speech",
      data: { text },
    };

    const response = await axios(requestConfig);

    if (response.status !== 200) {
      return null;
    }

    const data = await response.data;
    const audioContent = data.audioContent as string;
    return `data:audio/mp3;base64,${audioContent}`;
  };

  return {
    getAudioUrl,
  };
};
