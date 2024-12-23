import { useEffect, useState } from "react";
import { ThirdwebProvider, useAddress, useOwnedNFTs, useContract } from "@thirdweb-dev/react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import NavBar from "../components/NavBar";
import { ADDRESSES } from "../const/addresses";

const LoginSection = dynamic(() => import("../components/LoginSection"), { ssr: false });
const LoadingScreen = dynamic(() => import("../components/LoadingScreen"), { ssr: false });
const ClaimFarmer = dynamic(() => import("../components/ClaimFarmer"), { ssr: false });

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export default function MyApp({ Component, pageProps }: AppProps) {
  const address = typeof window !== 'undefined' ? useAddress() : null;
  const [loading, setLoading] = useState(true);
  const { contract: farmerContract } = useContract(ADDRESSES.FARMER);
  const { data: ownedFarmersData, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmerContract, address);

  useEffect(() => {
    if (!loadingOwnedFarmers) {
      setLoading(false);
    }
  }, [loadingOwnedFarmers]);

  if (!address) {
    return (
      <ChakraProvider>
        <LoginSection />
      </ChakraProvider>
    );
  }

  if (loading) {
    return (
      <ChakraProvider>
        <LoadingScreen />
      </ChakraProvider>
    );
  }

  if (ownedFarmersData?.length === 0) {
    return (
      <ChakraProvider>
        <Container maxW={"container.sm"} px={4}>
          <ClaimFarmer />
        </Container>
      </ChakraProvider>
    );
  }

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
        <NavBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}