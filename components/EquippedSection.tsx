import { Box, Card, Heading, Text, Stack, Flex, Button, Divider } from "@chakra-ui/react";
import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { ADDRESSES } from "../const/addresses";
import { ethers } from "ethers";
import Quantity from "./Quantity";

const EquippedSection = ({ equippedTools, contractIndex }: any) => {
    const address = useAddress();
    const { contract: toolContract } = useContract(ADDRESSES[`TOOLS_${contractIndex}`]);
    const { contract: stakingContract } = useContract(ADDRESSES[`STAKING_${contractIndex}`]);

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
        <Box>
            <Card p={4}>
                <Heading fontSize="lg" mb={4}>
                    Activated
                </Heading>
                {equippedTools && equippedTools[0].map((nft: ethers.BigNumber) => {
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