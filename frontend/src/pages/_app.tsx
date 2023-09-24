import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { GlobalStoreRoot } from "@/store/global";

import { WagmiConfig } from "wagmi";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { goerli, mainnet, polygon, sepolia } from "wagmi/chains";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { theme } from "@/styles/theme";
import { init } from "@airstack/airstack-react";

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY || "");

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "";

const chains = [polygon, sepolia, mainnet, goerli];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  appName: "Web3Modal",
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "dark",
  themeVariables: {
    "--w3m-color-mix": "#FF99AC",
    "--w3m-color-mix-strength": 60,
    "--w3m-font-family": "'Poppins', sans-serif",
  },
});

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  const app = getLayout(<Component {...pageProps} />) as ReactElement;

  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig config={wagmiConfig}>
        <GlobalStoreRoot>{app}</GlobalStoreRoot>
      </WagmiConfig>
    </ChakraProvider>
  );
};

export default App;
