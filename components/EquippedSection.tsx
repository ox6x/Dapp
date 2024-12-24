import { Box, Card, Heading, Text, Stack, Flex, Button, Divider, Spinner } from "@chakra-ui/react";
import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { getStakingAddress, getToolsAddress } from "../const/addresses"; // 动态获取地址
import { ethers } from "ethers";
import Quantity from "./Quantity";

const EquippedSection = ({ equippedTools }: any) => {
    const address = useAddress();
    const stakingAddress = getStakingAddress(); // 动态获取 Staking 地址
    const toolsAddress = getToolsAddress(); // 动态获取 Tools 地址

    const { contract: toolContract } = useContract(toolsAddress);
    const { contract: stakingContract } = useContract(stakingAddress);

    const handleOffClick = async (tokenId: number, quantity: number) => {
        if (!address) {
            console.error("No wallet connected.");
            return;
        }

        if (!stakingContract) {
            console.error("Staking contract not available.");
            return;
        }

        try {
            await stakingContract.call("withdraw", [tokenId, quantity]);
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

        if (!stakingContract) {
            console.error("Staking contract not available.");
            return;
        }

        try {
            await stakingContract.call("claimRewards", [tokenId]);
            console.log(`Claimed rewards for token ID ${tokenId}.`);
        } catch (error) {
            console.error("Error claiming rewards:", error);
        }
    };

    if (!equippedTools || !Array.isArray(equippedTools[0])) {
        return <Text>No equipped tools found.</Text>;
    }

    return (
        <Box>
            <Card p={4}>
                <Heading fontSize="lg" mb={4}>
                    Activated
                </Heading>
                {equippedTools[0].map((nft: ethers.BigNumber) => {
                    const tokenId = nft.toNumber();
                    const { data: nftData, isLoading: isLoadingNFT } = useNFT(toolContract, tokenId);
                    const { data: claimableRewards, isLoading: isLoadingRewards } = useContractRead(
                        stakingContract,
                        "getStakeInfoForToken",
                        [tokenId, address]
                    );

                    if (isLoadingNFT || isLoadingRewards) {
                        return <Spinner key={tokenId} />;
                    }

                    const equippedQuantity = ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0);
                    const claimableCarrot = ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18);

                    return (
                        <Card key={tokenId} p={5} borderRadius="lg" boxShadow="xl">
                            <Flex align="flex-start" justify="space-between" gap={6}>
                                <Stack spacing={4} align="center" w="50%">
                                    <MediaRenderer
                                        src={nftData?.metadata?.image || ""}
                                        height="200px"
                                        width="200px"
                                        style={{ borderRadius: "12px" }}
                                    />
                                    <Quantity
                                        minQuantity={1}
                                        onQuantityChange={(quantity) => handleOffClick(tokenId, quantity)}
                                        buttonText="Off"
                                    />
                                    <Button
                                        onClick={() => handleClaimClick(tokenId)}
                                        bg="green.400"
                                        color="white"
                                        _hover={{ bg: "green.500" }}
                                        borderRadius="md"
                                        w="full"
                                    >
                                        Claim
                                    </Button>
                                </Stack>
                                <Stack spacing={4} w="50%">
                                    <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                                        {nftData?.metadata?.name}
                                    </Text>
                                    <Divider />
                                    <Text fontSize="lg" fontWeight="medium" color="gray.600">
                                        Equipped Quantity: {equippedQuantity}
                                    </Text>
                                    <Text fontSize="lg" fontWeight="medium" color="blue.600">
                                        Token Rewards: {claimableCarrot}
                                    </Text>
                                </Stack>
                            </Flex>
                        </Card>
                    );
                })}
            </Card>
        </Box>
    );
};

export default EquippedSection;