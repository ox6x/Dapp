import { ThirdwebProvider, ConnectWallet } from "@thirdweb-dev/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import type { AppProps } from "next/app";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export default function MyApp({ Component, pageProps }: AppProps) {
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
        {/* 固定在右上角的钱包状态 */}
        <Box position="fixed" top="10px" right="10px">
          <ConnectWallet />
        </Box>
        {/* 页面内容 */}
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}