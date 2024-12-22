import { Box, Card, Heading, Skeleton } from "@chakra-ui/react";
import { Inventory } from "../components/Inventory";

interface InventoryCardProps {
  ownedTools: any; // Replace `any` with the actual type of owned tools if known
  loadingOwnedTools: boolean;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ ownedTools, loadingOwnedTools }) => {
  return (
    <Box mb={6}>
      <Card p={4}>
        <Heading fontSize="lg" mb={4}>
          Inventory
        </Heading>
        <Skeleton isLoaded={!loadingOwnedTools}>
          <Inventory nft={ownedTools} />
        </Skeleton>
      </Card>
    </Box>
  );
};

export default InventoryCard;