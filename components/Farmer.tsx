import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { ethers } from "ethers";

type FarmerProps = {
  farmers: any[];
  rewardBalance: any;
};

const Farmer: React.FC<FarmerProps> = ({ farmers, rewardBalance }) => {
  return (
    <Card p={4}>
      <Heading fontSize="lg" mb={4}>
        Farmer
      </Heading>
      {farmers?.map((nft) => (
        <Box
          key={nft.metadata.id}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mb={4}
        >
          <img
            src={nft.metadata.image}
            alt={nft.metadata.name}
            style={{ height: "150px", width: "100%", objectFit: "cover" }}
          />
        </Box>
      ))}
      <Text fontSize={"sm"} fontWeight={"bold"} mb={2}>
        bBNB Balance:
      </Text>
      {rewardBalance && (
        <Text fontSize={"sm"}>
          {ethers.utils.formatUnits(rewardBalance, 18)}
        </Text>
      )}
    </Card>
  );
};

export default Farmer;
