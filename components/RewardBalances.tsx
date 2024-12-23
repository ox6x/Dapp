 import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { ethers } from "ethers";

const RewardBalances = ({ rewardBalances }: { rewardBalances: { label: string, balance: any }[] }) => (
  <Box mb={6} className="container">
    <Card p={4} className="card">
      <Heading fontSize="lg" mb={4} className="title">Rewards</Heading>
      {rewardBalances.map(({ label, balance }, index) => (
        balance && (
          <Text key={index} fontSize={"sm"} fontWeight={"bold"} mb={2} className="text">
            {label} Balance: <span className="balance">{ethers.utils.formatUnits(balance, 18)}</span>
          </Text>
        )
      ))}
    </Card>
  </Box>
);

export default RewardBalances;