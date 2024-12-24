import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from './FarmerSection.module.scss';

const FarmerSection = ({ ownedFarmers, rewardBalance }: any) => (
  <Box className={styles.farmerSection}>
    <Card className={styles.card}>
      <Heading className={styles.heading}>
        Avatar
      </Heading>
      {ownedFarmers?.map((nft: any) => (
        <Box key={nft.metadata.id} className={styles.nftBox}>
          <MediaRenderer src={nft.metadata.image} className={styles.nftImage} />
        </Box>
      ))}
      <Text className={styles.balanceLabel}>
        bBNB Balance:
      </Text>
      {rewardBalance && (
        <Text className={styles.balanceValue}>{ethers.utils.formatUnits(rewardBalance, 18)}</Text>
      )}
    </Card>
  </Box>
);

export default FarmerSection;