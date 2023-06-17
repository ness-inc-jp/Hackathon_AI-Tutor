import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

export const useChat = () => {
  const conversation = async (
    inputMessage: string,
  ): Promise<{ enContent: string; jaContent: string }> => {
    const requestConfig: AxiosRequestConfig = {
      url: "/api/gpt/chat",
      method: "post",
      data: {
        message: inputMessage,
      },
    };

    // GPTの返答を取得
    const response = await axios(requestConfig);

    if (response.status !== 200 || response.data === "") {
      toast.error("エラーが発生しました");
      return {
        enContent: "",
        jaContent: "",
      };
    }

    const enContent = response.data.en;
    const jaContent = response.data.ja;

    return {
      enContent,
      jaContent,
    };
  };

  return {
    conversation,
  };
};
