import { ThirdwebProvider, ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export default function MyApp({ Component, pageProps }: AppProps) {
  const [address, setAddress] = useState<string | null>(null);

  // 确保 useAddress 只在浏览器端执行
  useEffect(() => {
    if (typeof window !== "undefined") {
      const walletAddress = useAddress();
      setAddress(walletAddress || null);
    }
  }, []);

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
        <Box position="fixed" top="10px" right="10px" zIndex="1000">
          <ConnectWallet style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} />
          {address && (
            <div style={{ marginTop: "5px", fontSize: "0.8rem", color: "gray", textAlign: "right" }}>
              已连接: {address}
            </div>
          )}
        </Box>
        {/* 页面内容 */}
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}