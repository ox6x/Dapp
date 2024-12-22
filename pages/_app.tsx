/** @jsxImportSource @emotion/react */
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import Head from "next/head";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect } from "react";
import Login from "../components/Login";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const address = useAddress();

  // 如果用户未登录，显示 Login 组件
  if (!address) {
    return (
      <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Login />
      </Box>
    );
  }

  // 如果已登录，渲染实际页面内容
  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={CLIENT_ID}
      activeChain={{
        chainId: 97,
        rpc: ["https://97.rpc.thirdweb.com"],
        nativeCurrency: {
          name: "Binance Smart Chain Testnet",
          symbol: "tBNB",
          decimals: 18,
        },
        name: "BSC Testnet",
        chain: "bsc-testnet",
        shortName: "tBNB",
        testnet: true,
        slug: "bsc-testnet",
      }}
    >
      <ChakraProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <AuthWrapper>
          <NavBar />
          <Box minH="100vh" p={4}>
            <Component {...pageProps} />
          </Box>
        </AuthWrapper>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;