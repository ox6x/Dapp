import { Box, Card, Heading } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { Equipped } from "../components/Equipped";

interface EquippedCardProps {
  equippedTools: BigNumber[][];
}

const EquippedCard: React.FC<EquippedCardProps> = ({ equippedTools }) => {
  return (
    <Box>
      <Card p={4}>
        <Heading fontSize="lg" mb={4}>
          Equipped Tools
        </Heading>
        {equippedTools &&
          equippedTools[0].map((nft) => (
            <Equipped key={nft.toNumber()} tokenId={nft.toNumber()} />
          ))}
      </Card>
    </Box>
  );
};

export default EquippedCard;