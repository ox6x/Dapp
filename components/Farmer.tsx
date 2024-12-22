import { MediaRenderer } from "@thirdweb-dev/react";
import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";

interface FarmerProps {
  ownedFarmers: any[];
  rewardBalance: BigNumber | null;
}

export const Farmer = ({ ownedFarmers, rewardBalance }: FarmerProps) => {
  return (
    <Box mb={6}>
      <Card p={4}>
        <Heading fontSize="lg" mb={4}>
          Farmer
        </Heading>
        {ownedFarmers?.map((nft) => (
          <Box key={nft.metadata.id} borderWidth="1px" borderRadius="lg" overflow="hidden" mb={4}>
            <MediaRenderer
              src={nft.metadata.image}
              height="150px"
              width="100%"
            />
          </Box>
        ))}
        <Text fontSize={"sm"} fontWeight={"bold"} mb={2}>
          bBNB Balance:
        </Text>
        {rewardBalance && (
          <Text fontSize={"sm"}>{ethers.utils.formatUnits(rewardBalance, 18)}</Text>
        )}
      </Card>
    </Box>
  );
};