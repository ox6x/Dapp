/** @jsxImportSource @emotion/react */
import { ThirdwebProvider, ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { ChakraProvider, Container, Flex, Heading, Link } from "@chakra-ui/react";
import type { AppProps } from "next/app";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export default function MyApp({ Component, pageProps }: AppProps) {
  const address = useAddress(); // 获取钱包地址

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
        {/* 全局导航功能 */}
        <Container maxW={"1200px"} py={4}>
          <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Heading>
              <Link href="/" style={{ textDecoration: "none" }}>
                BaseBot
              </Link>
            </Heading>
            <Flex alignItems={"center"} justifyContent={"flex-end"} w="auto">
              <Link href="/supplier" style={{ marginRight: "1rem", fontSize: "1rem", textDecoration: "none" }}>
                Supplier
              </Link>
              {/* 钱包连接按钮 */}
              <ConnectWallet style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} />
            </Flex>
          </Flex>
          {address && (
            <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "gray" }}>
              已连接: {address}
            </div>
          )}
        </Container>
        {/* 页面内容 */}
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}