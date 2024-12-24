import { Box, Card, Heading, Text, Stack, Flex } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from "./FarmerSection.module.scss";

const FarmerSection = ({ ownedFarmers, rewardBalance }: any) => (
  <Box className={styles.farmerSection} p={4}>
    <Card className={styles.card} p={6}>
      <Heading className={styles.heading} mb={4}>
        Avatar
      </Heading>
      <Stack spacing={6} className={styles.avatars}>
        {ownedFarmers?.map((nft: any) => (
          <Flex
            key={nft.metadata.id}
            className={styles.nftBox}
            direction="column"
            align="center"
            gap={4}
          >
            <MediaRenderer
              src={nft.metadata.image}
              alt={nft.metadata.name || "Farmer Avatar"}
              className={styles.nftImage}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <Text className={styles.nftName} fontWeight="bold" fontSize="lg">
              {nft.metadata.name || "Unknown"}
            </Text>
          </Flex>
        ))}
      </Stack>
      <Box className={styles.balanceSection} mt={6}>
        <Text className={styles.balanceLabel} fontWeight="medium" fontSize="md">
          bBNB Balance:
        </Text>
        {rewardBalance ? (
          <Text
            className={styles.balanceValue}
            fontWeight="bold"
            fontSize="lg"
            color="green.500"
          >
            {ethers.utils.formatUnits(rewardBalance, 18)}
          </Text>
        ) : (
          <Text className={styles.balanceValue} fontWeight="medium" color="gray.500">
            0
          </Text>
        )}
      </Box>
    </Card>
  </Box>
);

export default FarmerSection;