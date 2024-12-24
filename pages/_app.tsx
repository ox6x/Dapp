import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import NavBar from "../components/NavBar"; // 确保路径正确
import { ContractProvider } from "../contexts/ContractContext"; // Import the ContractProvider

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

if (!CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_CLIENT_ID is not defined in your environment variables.");
}

const activeChain = {
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
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider clientId={CLIENT_ID} activeChain={activeChain}>
      <ContractProvider>
        <ChakraProvider>
          <NavBar />
          <Component {...pageProps} />
        </ChakraProvider>
      </ContractProvider>
    </ThirdwebProvider>
  );
}