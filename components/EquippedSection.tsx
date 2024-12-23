import { Box, Card, Heading, Text, Stack, Flex, Button, Divider } from "@chakra-ui/react";
import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS, STAKING_BB_ADDRESS, TOOLS_BB_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import Quantity from "./Quantity"; // 確保路徑正確
import { useState } from 'react';

const EquippedSection = ({ equippedTools }: any) => {
    const address = useAddress();
    const [useBBAddress, setUseBBAddress] = useState(false);

    const selectedToolAddress = useBBAddress ? TOOLS_BB_ADDRESS : TOOLS_ADDRESS;
    const selectedStakingAddress = useBBAddress ? STAKING_BB_ADDRESS : STAKING_ADDRESS;

    const { contract: toolContract } = useContract(selectedToolAddress);
    const { contract: stakingContract } = useContract(selectedStakingAddress);

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
                <FormControl display="flex" alignItems="center" mb={4}>
                    <FormLabel htmlFor="contract-switch" mb="0">
                        Use BB Address
                    </FormLabel>
                    <Switch
                        id="contract-switch"
                        isChecked={useBBAddress}
                        onChange={() => setUseBBAddress(!useBBAddress)}
                    />
                </FormControl>
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
                            <Card key={tokenId} p={5} borderRadius="lg" boxShadow="xl">
                                <Flex align="flex-start" justify="space-between" gap={6}>
                                    {/* 左側圖片與操作 */}
                                    <Stack spacing={4} align="center" w="50%">
                                        {/* 圖片 */}
                                        <MediaRenderer
                                            src={nftData?.metadata?.image || ""}
                                            height="200px"
                                            width="200px"
                                            style={{ borderRadius: "12px" }}
                                        />
                                        {/* 數量選擇器 */}
                                        <Quantity
                                            minQuantity={1}
                                            onQuantityChange={(quantity) => handleOffClick(tokenId, quantity)}
                                            buttonText="Off"
                                        />
                                        {/* Claim 按鈕 */}
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

                                    {/* 右側 NFT 信息 */}
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