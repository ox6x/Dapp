import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex, Button, Divider } from "@chakra-ui/react";
import Quantity from "./Quantity"; // 確保路徑正確

interface EquippedProps {
    tokenId: number;
}

export const Equipped = (props: EquippedProps) => {
    const address = useAddress();

    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { data: nft } = useNFT(toolContract, props.tokenId);

    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    const { data: claimableRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [props.tokenId, address]
    );

    const handleOffClick = async (quantity: number) => {
        if (!address) {
            console.error("No wallet connected.");
            return;
        }

        try {
            await stakingContract?.call("withdraw", [props.tokenId, quantity]);
            console.log(`Withdrew ${quantity} items for token ID ${props.tokenId}.`);
        } catch (error) {
            console.error("Error withdrawing:", error);
        }
    };

    const handleClaimClick = async () => {
        if (!address) {
            console.error("No wallet connected.");
            return;
        }

        try {
            await stakingContract?.call("claimRewards", [props.tokenId]);
            console.log(`Claimed rewards for token ID ${props.tokenId}.`);
        } catch (error) {
            console.error("Error claiming rewards:", error);
        }
    };

    // 获取装备数量
    const equippedQuantity = ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0);
    const claimableCarrot = ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18);

    return (
        <Card p={5} borderRadius="lg" boxShadow="xl">
            <Flex align="flex-start" justify="space-between" gap={6}>
                {/* 左側圖片與操作 */}
                <Stack spacing={4} align="center" w="50%">
                    {/* 圖片 */}
                    <MediaRenderer
                        src={nft?.metadata?.image || ""}
                        height="200px"
                        width="200px"
                        style={{ borderRadius: "12px" }}
                    />
                    {/* 數量選擇器 */}
                    <Quantity
                        minQuantity={1}
                        onQuantityChange={handleOffClick}
                        buttonText="Off"
                    />
                    {/* Claim 按鈕 */}
                    <Button
                        onClick={handleClaimClick}
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
                        {nft?.metadata?.name}
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
};