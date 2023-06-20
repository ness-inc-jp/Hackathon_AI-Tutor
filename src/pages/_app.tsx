import { ChakraProvider } from "@chakra-ui/react";
import { Diary } from "@prisma/client";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { createContext, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "../components/Header";
import { theme } from "../utils/chakra";
import { trpc } from "../utils/trpc";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/600.css";
import "@fontsource/noto-sans-jp/700.css";

interface DiaryContextState {
  diary: Diary | undefined;
  setDiary: React.Dispatch<React.SetStateAction<Diary | undefined>>;
}

export const DiaryContext = createContext<DiaryContextState>({
  diary: undefined,
  setDiary: () => {},
});

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const [diary, setDiary] = useState<Diary>();

  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <DiaryContext.Provider value={{ diary, setDiary }}>
          <Header />
          <Component {...pageProps} />
          <Toaster />
        </DiaryContext.Provider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default trpc.withTRPC(MyApp);
