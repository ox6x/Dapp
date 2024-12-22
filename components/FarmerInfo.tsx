import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ethers } from "ethers";

interface FarmerInfoProps {
  ownedFarmers: any[]; // Farmer NFT 数据
  rewardBalance: string | undefined; // 奖励余额
}

export const FarmerInfo = ({ ownedFarmers, rewardBalance }: FarmerInfoProps) => (
  <Box mb={6}>
    <Card p={4}>
      <Heading fontSize="lg" mb={4}>
        Farmer
      </Heading>
      {ownedFarmers?.map((nft) => (
        <Box key={nft.metadata.id} borderWidth="1px" borderRadius="lg" overflow="hidden" mb={4}>
          <MediaRenderer src={nft.metadata.image} height="150px" width="100%" />
        </Box>
      ))}
      <Text fontSize={"sm"} fontWeight={"bold"} mb={2}>
        $CARROT Balance:
      </Text>
      <Text fontSize={"sm"}>
        {rewardBalance ? ethers.utils.formatUnits(rewardBalance, 18) : "Loading..."}
      </Text>
    </Card>
  </Box>
);