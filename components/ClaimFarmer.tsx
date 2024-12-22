import {
  MediaRenderer,
  Web3Button,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";

export function ClaimFarmer() {
  const { contract } = useContract(FARMER_ADDRESS);
  const { data: metadata } = useContractMetadata(contract);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bgGradient="linear(to-br, #F3F4F6, #FFFFFF)"
      fontFamily="'Inter', sans-serif"
    >
      {/* Header Section */}
      <Heading size="lg" color="#333" mb="6">
        Claim Farmer to Start Farming
      </Heading>

      {/* Content Container */}
      <Container
        maxW="400px"
        bg="white"
        p="8"
        borderRadius="12px"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        textAlign="center"
      >
        {/* MediaRenderer */}
        <Box borderRadius="12px" overflow="hidden" mb="6">
          <MediaRenderer
            src={metadata?.image}
            height="300px"
            width="300px"
            style={{ borderRadius: "12px" }}
          />
        </Box>

        {/* Description */}
        <Text mb="6" color="gray.600">
          Own a farmer to start earning rewards in the farming ecosystem.
        </Text>

        {/* Claim Button */}
        <Web3Button
          contractAddress={FARMER_ADDRESS}
          action={(contract) => contract.erc1155.claim(0, 1)}
          style={{
            backgroundColor: "#0052FF",
            color: "#FFFFFF",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Claim Farmer
        </Web3Button>
      </Container>
    </Flex>
  );
}