/** @jsxImportSource @emotion/react */
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider, Box } from "@chakra-ui/react";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export default function Home() {
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
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <h1>Welcome to MyApp</h1>
        </Box>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}