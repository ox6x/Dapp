import { Box, Card, Heading, Text, Stack, Flex, Button, Divider } from "@chakra-ui/react";
import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import Quantity from "./Quantity";
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
                <Heading className={styles.heading}>Activated</Heading>
                {equippedTools &&
                    equippedTools[0].map((nft: ethers.BigNumber) => {
                        const tokenId = nft.toNumber();
                        const { data: nftData } = useNFT(toolContract, tokenId);
                        const { data: claimableRewards } = useContractRead(
                            stakingContract,
                            "getStakeInfoForToken",
                            [tokenId, address]
                        );

                        const equippedQuantity = ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0);
                        const claimableCarrot = ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18);

                        return (
                            <Flex
                                key={tokenId}
                                className={styles.nftBox}
                                direction={{ base: "column", md: "row" }}
                                border="1px solid #e2e8f0"
                                borderRadius="lg"
                                p={4}
                                mb={4}
                                gap={4}
                            >
                                {/* 左側：圖片和名稱 */}
                                <Stack
                                    spacing={4}
                                    className={styles.leftSection}
                                    align="center"
                                    flex={{ base: "0 0 auto", md: "0 0 200px" }}
                                >
                                    <MediaRenderer
                                        src={nftData?.metadata?.image || ""}
                                        className={styles.nftImage}
                                        alt={nftData?.metadata?.name || "NFT Image"}
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <Text
                                        className={styles.nftName}
                                        fontWeight="bold"
                                        fontSize="lg"
                                        textAlign="center"
                                    >
                                        {nftData?.metadata?.name}
                                    </Text>
                                </Stack>

                                {/* 右側：操作和信息 */}
                                <Flex
                                    direction="column"
                                    justify="space-between"
                                    className={styles.rightSection}
                                    flex="1"
                                >
                                    {/* 操作按鈕 */}
                                    <Stack spacing={4} direction="row" justify="space-between">
                                        <Quantity
                                            minQuantity={1}
                                            onQuantityChange={(quantity) => handleOffClick(tokenId, quantity)}
                                            buttonText="Off"
                                            className={styles.quantityButton}
                                        />
                                        <Button
                                            onClick={() => handleClaimClick(tokenId)}
                                            className={styles.claimButton}
                                            bg="blue.500"
                                            color="white"
                                            _hover={{ bg: "blue.400" }}
                                            _active={{ bg: "blue.600" }}
                                            flex="0 0 auto"
                                        >
                                            Claim
                                        </Button>
                                    </Stack>

                                    {/* 獎勵和裝備數量 */}
                                    <Box mt={4}>
                                        <Divider className={styles.divider} />
                                        <Flex
                                            justify="space-between"
                                            className={styles.rewardInfo}
                                            mt={4}
                                            flexWrap="wrap"
                                        >
                                            <Text className={styles.equippedQuantity} fontWeight="medium">
                                                Equipped Quantity: {equippedQuantity}
                                            </Text>
                                            <Text className={styles.tokenRewards} fontWeight="medium" color="green.500">
                                                Token Rewards: {claimableCarrot}
                                            </Text>
                                        </Flex>
                                    </Box>
                                </Flex>
                            </Flex>
                        );
                    })}
            </Card>
        </Box>
    );
};

export default EquippedSection;