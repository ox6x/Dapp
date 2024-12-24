import { Box, Card, Heading, Text, Stack, Flex, Button, Divider } from "@chakra-ui/react";
import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import Quantity from "./Quantity"; // 確保路徑正確
import styles from './EquippedSection.module.scss';

const EquippedSection = ({ equippedTools }: any) => {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    const handleOffClick = async (tokenId: number, quantity: number) => {
        if (!address) {
            console.error("No wallet connected.");
            return;
        }

        try {
            await stakingContract?.call("withdraw", [tokenId, quantity]);
            console.log(`Withdrew ${quantity} items for token ID ${tokenId}.`);
        } catch (error) {
            console.error("Error withdrawing:", error);
        }
    };

    const handleClaimClick = async (tokenId: number) => {
        if (!address) {
            console.error("No wallet connected.");
            return;
        }

        try {
            await stakingContract?.call("claimRewards", [tokenId]);
            console.log(`Claimed rewards for token ID ${tokenId}.`);
        } catch (error) {
            console.error("Error claiming rewards:", error);
        }
    };

    return (
        <Box className={styles.equippedSection}>
            <Card className={styles.card}>
                <Heading className={styles.heading}>
                    Activated
                </Heading>
                {equippedTools &&
                    equippedTools[0].map((nft: ethers.BigNumber) => {
                        const tokenId = nft.toNumber();
                        const { data: nftData } = useNFT(toolContract, tokenId);
                        const { data: claimableRewards } = useContractRead(
                            stakingContract,
                            "getStakeInfoForToken",
                            [tokenId, address]
                        );

                        // 获取装备数量和奖励
                        const equippedQuantity = ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0);
                        const claimableCarrot = ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18);

                        return (
                            <Box key={tokenId} className={styles.nftBox}>
                                <Stack spacing={4} className={styles.leftSection}>
                                    <MediaRenderer
                                        src={nftData?.metadata?.image || ""}
                                        className={styles.nftImage}
                                    />
                                    <Quantity
                                        minQuantity={1}
                                        onQuantityChange={(quantity) => handleOffClick(tokenId, quantity)}
                                        buttonText="Off"
                                        className={styles.quantityButton}
                                    />
                                    <Button
                                        onClick={() => handleClaimClick(tokenId)}
                                        className={styles.claimButton}
                                    >
                                        Claim
                                    </Button>
                                </Stack>

                                <Stack spacing={4} className={styles.rightSection}>
                                    <Text className={styles.nftName}>
                                        {nftData?.metadata?.name}
                                    </Text>
                                    <Divider className={styles.divider} />
                                    <Text className={styles.equippedQuantity}>
                                        Equipped Quantity: {equippedQuantity}
                                    </Text>
                                    <Text className={styles.tokenRewards}>
                                        Token Rewards: {claimableCarrot}
                                    </Text>
                                </Stack>
                            </Box>
                        );
                    })}
            </Card>
        </Box>
    );
};

export default EquippedSection;