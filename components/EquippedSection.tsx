import { Box, Card, Heading } from "@chakra-ui/react";
import { Equipped } from "./Equipped";
import { BigNumber } from "ethers";

const EquippedSection = ({ equippedTools }: any) => (
  <Box>
    <Card p={4}>
      <Heading fontSize="lg" mb={4}>
        Activated
      </Heading>
      {equippedTools &&
        equippedTools[0].map((nft: BigNumber) => (
          <Equipped key={nft.toNumber()} tokenId={nft.toNumber()} />
        ))}
    </Card>
  </Box>
);

export default EquippedSection;
