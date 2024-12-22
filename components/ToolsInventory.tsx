import { Box, Card, Heading } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { Equipped } from "./Equipped";

interface EquippedToolsProps {
  equippedTools: any[]; // 已装备的工具数据
}

export const EquippedTools = ({ equippedTools }: EquippedToolsProps) => (
  <Box>
    <Card p={4}>
      <Heading fontSize="lg" mb={4}>
        Equipped Tools
      </Heading>
      {equippedTools?.[0]?.map((nft: BigNumber) => (
        <Equipped key={nft.toNumber()} tokenId={nft.toNumber()} />
      )) || "No equipped tools"}
    </Card>
  </Box>
);