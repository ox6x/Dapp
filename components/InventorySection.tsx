import { Box, Card, Heading, Skeleton } from "@chakra-ui/react";
import { Inventory } from "./Inventory";

const InventorySection = ({ ownedTools, loadingOwnedTools }: any) => (
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

export default InventorySection;
