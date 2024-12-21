import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex } from "@chakra-ui/react";
import NFTQuantityTransaction from "./NFTQuantityTransaction"; // 引入数量选择组件

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

    // Unequip 逻辑
    const handleUnequip = async (quantity: number) => {
        if (!stakingContract) return;

        try {
            await stakingContract.call("withdraw", [props.tokenId, quantity]);
            alert(`Successfully unequipped ${quantity} NFTs!`);
        } catch (error) {
            console.error("Unequip failed:", error);
            alert("Unequip failed, please try again.");
        }
    };

    // Claim Rewards 逻辑（数量可选）
    const handleClaimRewards = async () => {
        if (!stakingContract) return;

        try {
            await stakingContract.call("claimRewards", [props.tokenId]);
            alert("Successfully claimed rewards!");
        } catch (error) {
            console.error("Claim failed:", error);
            alert("Claim rewards failed, please try again.");
        }
    };

    return (
        <Box>
            {nft && (
                <Card p={5}>
                    <Flex alignItems="center">
                        {/* 图片区域 */}
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="150px"
                                width="150px"
                            />
                            <Text fontSize="lg" fontWeight="bold" textAlign="center" mt={2}>
                                {nft.metadata.name}
                            </Text>
                        </Box>

                        {/* 按钮及属性区域 */}
                        <Flex flex={1} justifyContent="space-between" ml={5}>
                            {/* 按钮区域 */}
                            <Stack spacing={3} justifyContent="center">
                                {/* 使用 NFTQuantityTransaction 实现 Unequip 的数量选择 */}
                                <NFTQuantityTransaction
                                    initialQuantity={1}
                                    onTransaction={(quantity) => handleUnequip(quantity)}
                                    getPrice={() => "Free"} // 无价格概念
                                    onTransactionConfirmed={() => alert("Unequip confirmed!")}
                                />

                                {/* 直接 Claim Rewards 按钮 */}
                                <Box>
                                    <button
                                        onClick={handleClaimRewards}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "5px",
                                            background: "#3182ce",
                                            color: "#fff",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Claim $CARROT
                                    </button>
                                </Box>
                            </Stack>

                            {/* 数值属性区域 */}
                            <Stack spacing={2} textAlign="right">
                                <Text fontSize="md">Equipped:</Text>
                                <Text fontWeight="bold">
                                    {ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0)}
                                </Text>
                                <Text fontSize="md">Claimable $CARROT:</Text>
                                <Text fontWeight="bold">
                                    {ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18)}
                                </Text>
                            </Stack>
                        </Flex>
                    </Flex>
                </Card>
            )}
        </Box>
    );
};