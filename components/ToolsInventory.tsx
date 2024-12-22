import { Box, Card, Heading, Skeleton } from "@chakra-ui/react";
import { Inventory } from "./Inventory";

interface ToolsInventoryProps {
  ownedTools: any[]; // 工具 NFT 数据
  loadingOwnedTools: boolean; // 工具加载状态
}

export const ToolsInventory = ({ ownedTools, loadingOwnedTools }: ToolsInventoryProps) => (
  <Box mb={6}>
    <Card p={4}>
      <Heading fontSize="lg" mb={4}>
        Inventory
      </Heading>
      <Skeleton isLoaded={!loadingOwnedTools}>
        {ownedTools.length > 0 ? <Inventory nft={ownedTools} /> : "No tools available"}
      </Skeleton>
    </Card>
  </Box>
);