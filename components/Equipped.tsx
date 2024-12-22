import React, { useState } from "react";
import { Text, Box, Stack, Card } from "@chakra-ui/react";
import Quantity from "./Quantity";

interface EquippedProps {
  tokenId: number;
}

const Equipped: React.FC<EquippedProps> = ({ tokenId }) => {
  const [status, setStatus] = useState("Off");

  const handleQuantityChange = (quantity: number) => {
    setStatus(quantity === 1 ? "On" : "Off");
  };

  return (
    <Card>
      <Stack spacing={4}>
        <Text>Token ID: {tokenId}</Text>
        <Text>Status: {status}</Text>
        <Quantity
          onQuantityChange={handleQuantityChange}
          minQuantity={0}
          buttonText={status === "Off" ? "Activate" : "Deactivate"}
        />
      </Stack>
    </Card>
  );
};

export default Equipped;