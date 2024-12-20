import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex } from "@chakra-ui/react";
import { useState } from "react";

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

    // 添加数量选择的状态
    const [quantity, setQuantity] = useState<number>(1);

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(Math.max(1, newQuantity)); // 确保数量至少为1
    };

    return (
        <Box>
            {nft && (
                <Card p={5}>
                    <Flex>
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="80%"
                                width="80%"
                            />
                        </Box>
                        <Stack spacing={1}>
                            <Text fontSize={"2xl"} fontWeight={"bold"}>{nft.metadata.name}</Text>
                            <Text>Equipped: {ethers.utils.formatUnits(claimableRewards[0], 0)}</Text>

                            {/* 数量选择器 */}
                            <Flex align="center" gap={2}>
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#f56565",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        handleQuantityChange(isNaN(value) ? 1 : value);
                                    }}
                                    style={{
                                        width: "60px",
                                        textAlign: "center",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        padding: "5px",
                                    }}
                                />
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#48bb78",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    +
                                </button>
                            </Flex>

                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={(contract) => contract.call("withdraw", [props.tokenId, quantity])}
                            >
                                Unequip {quantity}
                            </Web3Button>
                        </Stack>
                    </Flex>
                    <Box mt={5}>
                        <Text>Claimable $CARROT:</Text>
                        <Text>{ethers.utils.formatUnits(claimableRewards[1], 18)}</Text>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS}
                            action={(contract) => contract.call("claimRewards", [props.tokenId])}
                        >
                            Claim $CARROT
                        </Web3Button>
                    </Box>
                </Card>
            )}
        </Box>
    );
};