import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const FarmerSection = ({ ownedFarmers, rewardBalance }: any) => (
  <Box mb={6}>
    <Card p={4}>
      <Heading fontSize="lg" mb={4}>
        Avatar
      </Heading>
      {ownedFarmers?.map((nft: any) => (
        <Box key={nft.metadata.id} borderWidth="1px" borderRadius="lg" overflow="hidden" mb={4}>
          <MediaRenderer src={nft.metadata.image} height="150px" width="100%" />
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

export default FarmerSection;