import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex, Button } from "@chakra-ui/react";
import Quantity from "./Quantity"; // 确保路径正确

interface EquippedProps {
    tokenId: number;
};

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
        <Box>
            {nft && (
                <Card p={5}>
                    <Flex>
                        {/* 左側圖片部分 */}
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="150px"
                                width="150px"
                                style={{ borderRadius: "8px" }}
                            />
                            {/* 數量選擇器與按鈕 */}
                            <Stack spacing={4} mt={4} align="center">
                                <Quantity
                                    minQuantity={1}
                                    onQuantityChange={handleOffClick}
                                    buttonText="Off"
                                />
                                <Button
                                    onClick={handleClaimClick}
                                    style={{
                                        padding: "6px 12px",
                                        background: "#38a169",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Claim
                                </Button>
                            </Stack>
                        </Box>

                        {/* 右側功能部分 */}
                        <Stack spacing={4} ml={4} align="flex-start">
                            {/* 名稱與數量、Token */}
                            <Text fontSize={"lg"} fontWeight={"bold"} textAlign="center">
                                {nft.metadata.name} ({equippedQuantity})
                            </Text>
                            <Text fontSize={"sm"} textAlign="center" color="gray.600">
                                Token: {claimableCarrot}
                            </Text>
                        </Stack>
                    </Flex>
                </Card>
            )}
        </Box>
    );
};