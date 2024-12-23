import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import './FarmerSection.module.scss';

const FarmerSection = ({ ownedFarmers, rewardBalance, rewardBalanceBB }: any) => (
  <Box mb={6} className="container">
    <Card p={4} className="card">
      <Heading fontSize="lg" mb={4} className="title">
        Avatar
      </Heading>
      {ownedFarmers?.map((nft: any) => (
        <Box key={nft.metadata.id} className="nft-box">
          <MediaRenderer src={nft.metadata.image} height="150px" width="100%" />
        </Box>
      ))}
      {rewardBalance && (
        <>
          <Text fontSize={"sm"} fontWeight={"bold"} mb={2} className="text">
            bBNB Balance:
          </Text>
          <Text fontSize={"sm"} className="balance">{ethers.utils.formatUnits(rewardBalance, 18)}</Text>
        </>
      )}
      {rewardBalanceBB && (
        <>
          <Text fontSize={"sm"} fontWeight={"bold"} mb={2} className="text">
            BB Balance:
          </Text>
          <Text fontSize={"sm"} className="balance">{ethers.utils.formatUnits(rewardBalanceBB, 18)}</Text>
        </>
      )}
    </Card>
  </Box>
);

export default FarmerSection;