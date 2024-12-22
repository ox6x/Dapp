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

    const [withdrawQuantity, setWithdrawQuantity] = useState<number>(1);

    const handleQuantityChange = (quantity: number) => {
        setWithdrawQuantity(quantity);
    };

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
                            <Text fontSize={"lg"} fontWeight={"bold"} textAlign="center" mt={2}>
                                {nft.metadata.name}
                            </Text>
                            <Text fontSize={"sm"} textAlign="center">
                                Equipped: {ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0)}
                            </Text>
                        </Box>

                        {/* 右侧功能部分 */}
                        <Stack spacing={4} ml={4} align="flex-start">
                            {/* 数量选择器 */}
                            <Quantity
                                minQuantity={1}
                                onQuantityChange={handleQuantityChange}
                                buttonText="Off"
                            />

                            {/* 奖励信息 */}
                            <Box>
                                <Text>Claimable $CARROT:</Text>
                                <Text fontSize={"lg"} fontWeight={"bold"}>
                                    {ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18)}
                                </Text>
                            </Box>

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