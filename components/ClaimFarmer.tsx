import {
  MediaRenderer,
  Web3Button,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading, Text, Button } from "@chakra-ui/react";

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
      {/* Header */}
      <Box mb="8">
        <img
          src="https://via.placeholder.com/150" // Replace with your app logo or relevant image
          alt="App Logo"
          style={{ width: "150px" }}
        />
      </Box>

      {/* Main Content */}
      <Container
        maxW="500px"
        bg="white"
        p="8"
        borderRadius="12px"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        textAlign="center"
      >
        <Heading size="lg" mb="6" color="#333">
          Claim Your Farmer
        </Heading>
        <Text mb="4" color="gray.600">
          Start farming by claiming your farmer NFT!
        </Text>

        {/* MediaRenderer */}
        <Box
          borderRadius="12px"
          overflow="hidden"
          my="6"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <MediaRenderer
            src={metadata?.image}
            height="300px"
            width="300px"
          />
        </Box>

        {/* Claim Button */}
        <Web3Button
          contractAddress={FARMER_ADDRESS}
          action={(contract) => contract.erc1155.claim(0, 1)}
          style={{
            width: "100%",
            padding: "12px 0",
            backgroundColor: "#0052FF",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#003FCC")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#0052FF")
          }
        >
          Claim Farmer
        </Web3Button>
      </Container>
    </Flex>
  );
}