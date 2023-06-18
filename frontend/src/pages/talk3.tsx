import { Button } from "@chakra-ui/react";
import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import { NextPage } from "next";

const Talk3Page: NextPage = () => {
  // const { messages } = useChat();

  const onClickChat = async () => {
    const requestConfig: AxiosRequestConfig = {
      method: "POST",
      url: "/api/gpt/stream",
      data: {
        text: "こんにちは",
      },
      responseType: "stream",
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        console.log(progressEvent);
        const dataChunk = progressEvent.event.target.response;
        console.log(dataChunk);
      },
    };

    await axios(requestConfig);
  };

  return <Button onClick={onClickChat}>Chat</Button>;
};

export default Talk3Page;
