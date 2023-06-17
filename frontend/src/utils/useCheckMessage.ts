import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

export const useCheckMessage = () => {
  const checkMessage = async (aiMessage: string, userMessage: string): Promise<string> => {
    const requestConfig: AxiosRequestConfig = {
      url: "/api/gpt/check",
      method: "POST",
      data: {
        aiMessage,
        userMessage,
      },
    };

    const response = await axios(requestConfig);

    if (response.status !== 200 || !response.data) {
      toast.error("エラーが発生しました。");
      return "";
    }

    return response.data;
  };

  return { checkMessage };
};
