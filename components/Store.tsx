import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import {
  Text,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Box,
  SimpleGrid,
  Card,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NFT from "../components/NFT";
import { useEffect, useState } from "react";

export default function Store() {
  const router = useRouter();
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data: nfts, isLoading } = useNFTs(contract);

  const [address, setAddress] = useState<string | null>(null);

  // 偵測使用者地址是否已連接
  useEffect(() => {
    const fetchAddress = async () => {
      const walletAddress = await contract?.wallet.getAddress();
      setAddress(walletAddress || null);
    };
    fetchAddress();
  }, [contract]);

  if (!address) {
    return (
      <Container maxW="container.sm">
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Heading size="md" mb={4}>
            Please Connect Your Wallet
          </Heading>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </Flex>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxW="container.sm">
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Spinner size="lg" />
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW={"container.lg"} py={6}>
      <Flex justifyContent="space-between" mb={6}>
        <Button onClick={() => router.back()}>Back</Button>
        <Heading>Store</Heading>
      </Flex>

      <Text mb={4}>
        Purchase tools with $CARROTS to increase your earnings.
      </Text>

      {nfts?.length === 0 ? (
        <Text>No tools available for purchase.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {nfts?.map((nftItem) => (
            <Card key={nftItem.metadata.id} p={4}>
              <NFT nft={nftItem} />
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}