import { Text, Card, Button, Flex, Input, Box } from "@chakra-ui/react";
import { MediaRenderer, useContract } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useState } from "react";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const [quantity, setQuantity] = useState(1); // State for quantity
  const { contract } = useContract(TOOLS_ADDRESS);

  const handleClaim = async () => {
    if (!contract) return;
    try {
      // Claim the NFT
      await contract.erc1155.claim(nft.metadata.id, quantity);
      setQuantity(1); // Reset quantity after claim
      alert("NFT claimed successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to claim NFT.");
    }
  };

  return (
    <Card key={nft.metadata.id} overflow={"hidden"} p={4}>
      {/* NFT Image */}
      <MediaRenderer
        src={nft.metadata.image}
        height="100%"
        width="100%"
      />

      {/* NFT Name */}
      <Text fontSize={"2xl"} fontWeight={"bold"} my={5} textAlign={"center"}>
        {nft.metadata.name}
      </Text>

      {/* Pricing (Mock Example) */}
      <Text textAlign={"center"} my={5}>
        Cost: {ethers.utils.formatEther("0.05")} ETH
      </Text>

      {/* Quantity Selector */}
      <Box my={5}>
        <Flex justifyContent="center" alignItems="center" gap={3}>
          <Button
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setQuantity(value > 0 ? value : 1); // Ensure quantity is at least 1
            }}
            width="60px"
            textAlign="center"
          />
          <Button size="sm" onClick={() => setQuantity(quantity + 1)}>
            +
          </Button>
        </Flex>
        <Text textAlign="center" mt={3}>
          Total Cost: {(0.05 * quantity).toFixed(2)} ETH
        </Text>
      </Box>

      {/* Claim Button */}
      <Button
        colorScheme="teal"
        width="100%"
        onClick={handleClaim}
        isDisabled={quantity <= 0} // Disable button if quantity is invalid
      >
        Claim {quantity} NFT{quantity > 1 ? "s" : ""} ({(0.05 * quantity).toFixed(2)} ETH)
      </Button>
    </Card>
  );
}