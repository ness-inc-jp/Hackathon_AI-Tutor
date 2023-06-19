import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Header } from "../components/Header";
import { theme } from "../utils/chakra";
import { trpc } from "../utils/trpc";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
        <Toaster />
      </SessionProvider>
    </ChakraProvider>
  );
}

export default trpc.withTRPC(MyApp);
