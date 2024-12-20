/** @jsxImportSource @emotion/react */
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import Head from 'next/head';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={CLIENT_ID}
      activeChain={{
        chainId: 97,  // 修改为 97
        rpc: ["https://97.rpc.thirdweb.com"],  // 修改为链 ID 97 对应的 RPC URL
        nativeCurrency: {
          name: "Binance Smart Chain Testnet",  // 修改为 Testnet 的名称
          symbol: "tBNB",  // 修改为 Testnet 的代币符号
          decimals: 18,
        },
        name: "BSC Testnet",
        chain: "bsc-testnet",
        shortName: "tBNB",
        testnet: true,  // Testnet 环境
        slug: "bsc-testnet",  // 修改为 BSC Testnet 的 URL 友好名
      }}
    >
      <ChakraProvider>
        <Head>
          {/* Prevent mobile scaling */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <NavBar />
        <Box minH="100vh" p={4}>
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;