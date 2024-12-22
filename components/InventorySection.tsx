import React, { useState } from "react";
import { Box, Card, Heading, Skeleton, Text } from "@chakra-ui/react";
import Quantity from "./Quantity";

interface Tool {
  id: string;
  name: string;
  description: string;
}

interface InventorySectionProps {
  ownedTools: Tool[]; // 工具列表
  loadingOwnedTools: boolean; // 是否加载中
}

const InventorySection: React.FC<InventorySectionProps> = ({
  ownedTools,
  loadingOwnedTools,
}) => {
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [toolId: string]: number;
  }>({});

  // 处理数量变化
  const handleQuantityChange = (toolId: string, quantity: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [toolId]: quantity,
    }));
  };

  return (
    <Box mb={6}>
      <Card p={4}>
        <Heading fontSize="lg" mb={4}>
          Inventory
        </Heading>
        <Skeleton isLoaded={!loadingOwnedTools}>
          {ownedTools.map((tool) => (
            <Box key={tool.id} mb={4} p={4} borderWidth="1px" borderRadius="md">
              {/* 工具信息 */}
              <Text fontWeight="bold" fontSize="md">
                {tool.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {tool.description}
              </Text>

              {/* 动态数量选择器 */}
              <Quantity
                minQuantity={1}
                buttonText="Confirm Quantity"
                onQuantityChange={(quantity) =>
                  handleQuantityChange(tool.id, quantity)
                }
              />
            </Box>
          ))}
        </Skeleton>
      </Card>
    </Box>
  );
};

export default InventorySection;