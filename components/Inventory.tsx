import React, { useState } from "react";
import { Text, Box, Card, SimpleGrid, Stack } from "@chakra-ui/react";
import Quantity from "./Quantity";

interface InventoryProps {
  nft: Array<{ metadata: { name: string } }>;
}

const Inventory: React.FC<InventoryProps> = ({ nft }) => {
  const [statusList, setStatusList] = useState<{ [key: string]: string }>({});

  const handleQuantityChange = (key: string, quantity: number) => {
    setStatusList((prev) => ({
      ...prev,
      [key]: quantity === 1 ? "On" : "Off",
    }));
  };

  return (
    <Box>
      <SimpleGrid columns={2} spacing={4}>
        {nft.map((item, index) => {
          const key = item.metadata.name;
          const status = statusList[key] || "Off";

          return (
            <Card key={index}>
              <Stack spacing={4}>
                <Text>NFT Name: {item.metadata.name}</Text>
                <Text>Status: {status}</Text>
                <Quantity
                  onQuantityChange={(quantity) => handleQuantityChange(key, quantity)}
                  minQuantity={0}
                  buttonText={status === "Off" ? "Activate" : "Deactivate"}
                />
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Inventory;