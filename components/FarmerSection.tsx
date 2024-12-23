import { Box, Card, Heading, Text } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from "./FarmerSection.module.scss"; // 引入 SCSS 模块

const FarmerSection = ({ ownedFarmers, rewardBalance }: any) => (
  <Box className={styles["farmer-section-container"]}>
    <Card className={styles["farmer-card"]}>
      <Heading className={styles["farmer-heading"]}>Avatar</Heading>
      {ownedFarmers?.map((nft: any) => (
        <Box key={nft.metadata.id} className={styles["farmer-item"]}>
          <MediaRenderer src={nft.metadata.image} height="150px" width="100%" />
        </Box>
      ))}
      <Text className={styles["farmer-text"]}>bBNB Balance:</Text>
      {rewardBalance && (
        <Text className={styles["farmer-reward"]}>
          {ethers.utils.formatUnits(rewardBalance, 18)}
        </Text>
      )}
    </Card>
  </Box>
);

export default FarmerSection;