import { MediaRenderer, Web3Button, useContract } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { Text, Box, Button, Card, Stack, Heading, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  nft: NFT[] | undefined;
};

export default function Store({ nft }: Props) {
  const { contract } = useContract(TOOLS_ADDRESS);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, newQuantity), // 確保數量至少為 1
    }));
  };

  async function buyTool(id: string, quantity: number) {
    try {
      await contract?.erc1155.claim(id, quantity);
      alert(`Successfully purchased ${quantity} tool(s)!`);
      setQuantities((prev) => ({ ...prev, [id]: 1 })); // 重置數量
    } catch (error) {
      console.error(error);
      alert("Purchase failed. Please try again.");
    }
  }

  if (!nft || nft.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Text>No tools available in the store.</Text>
      </Box>
    );
  }

  return (
    <Box maxWidth="1000px" margin="0 auto" padding="20px">
      <Heading mb={6} textAlign="center">Tool Store</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {nft.map((item) => (
          <Card key={item.metadata.id} p={5} boxShadow="md">
            <Stack alignItems={"center"}>
              <MediaRenderer src={item.metadata.image} height="150px" width="150px" />
              <Text fontWeight="bold">{item.metadata.name}</Text>

              {/* 數量選擇器 */}
              <Box display="flex" justifyContent="center" alignItems="center" gap={3} my={3}>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleQuantityChange(item.metadata.id, (quantities[item.metadata.id] || 1) - 1)}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantities[item.metadata.id] || 1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handleQuantityChange(item.metadata.id, isNaN(value) ? 1 : value);
                  }}
                  style={{
                    width: "60px",
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px",
                  }}
                />
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => handleQuantityChange(item.metadata.id, (quantities[item.metadata.id] || 1) + 1)}
                >
                  +
                </Button>
              </Box>

              {/* 購買按鈕 */}
              <Button
                colorScheme="teal"
                width="100%"
                onClick={() => buyTool(item.metadata.id, quantities[item.metadata.id] || 1)}
              >
                Buy {quantities[item.metadata.id] || 1} for {(0.05 * (quantities[item.metadata.id] || 1)).toFixed(2)} ETH
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}