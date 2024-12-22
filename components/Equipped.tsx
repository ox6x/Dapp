import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex } from "@chakra-ui/react";
import { useState } from "react";
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

    // 获取装备数量
    const equippedQuantity = ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0);
    const claimableCarrot = ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18);

    return (
        <Box>
            {nft && (
                <Card p={5}>
                    <Flex>
                        {/* 图片部分 */}
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="150px"
                                width="150px"
                                style={{ borderRadius: "8px" }}
                            />
                            {/* 名称与装备数量 */}
                            <Text fontSize={"lg"} fontWeight={"bold"} textAlign="center" mt={2}>
                                {nft.metadata.name} ({equippedQuantity})
                            </Text>
                            {/* 奖励信息 */}
                            <Text fontSize={"sm"} textAlign="center" color="gray.600">
                                Claimable: {claimableCarrot} $CARROT
                            </Text>
                        </Box>

                        {/* 右侧功能部分 */}
                        <Stack spacing={4} ml={4} align="flex-start">
                            {/* 数量选择器，整合为 Off 按钮 */}
                            <Quantity
                                minQuantity={1}
                                onQuantityChange={handleOffClick} // 调用智能合约的 withdraw 方法
                                buttonText="Off"
                            />

                            {/* Claim 按钮 */}
                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={(contract) => contract.call("claimRewards", [props.tokenId])}
                            >
                                Claim
                            </Web3Button>
                        </Stack>
                    </Flex>
                </Card>
            )}
        </Box>
    );
};