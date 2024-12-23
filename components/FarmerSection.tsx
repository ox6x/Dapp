import { Box, Card, Heading } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import RewardBalances from "./RewardBalances"; // Import the new component
import './FarmerSection.module.scss';

const FarmerSection = ({ ownedFarmers, rewardBalances }: any) => (
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
      <RewardBalances rewardBalances={rewardBalances} /> {/* Use the new component */}
    </Card>
  </Box>
);

export default FarmerSection;