import {
    MediaRenderer,
    Web3Button,
    useAddress,
    useContract,
    useContractRead,
    useNFT,
} from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex, Button, Divider, Input } from "@chakra-ui/react";
import { useState, useMemo } from "react";

interface EquippedProps {
    tokenId: number;
}

export const Equipped = ({ tokenId }: EquippedProps) => {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { data: nft } = useNFT(toolContract, tokenId);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);
    const { data: claimableRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [tokenId, address]
    );
    const [quantity, setQuantity] = useState<number>(1);

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(Math.max(1, newQuantity));
    };

    const equipped = useMemo(
        () =>
            claimableRewards ? ethers.utils.formatUnits(claimableRewards[0], 0) : "0",
        [claimableRewards]
    );

    const rewards = useMemo(
        () =>
            claimableRewards ? ethers.utils.formatUnits(claimableRewards[1], 18) : "0",
        [claimableRewards]
    );

    return (
        <Box>
            {nft && (
                <Card p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                    <Flex direction={{ base: "column", md: "row" }} align="center" gap={5}>
                        {/* 左側圖片 */}
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="100px"
                                width="100px"
                            />
                        </Box>

                        {/* 中間文字 */}
                        <Stack spacing={3} flex="1">
                            <Text fontSize="xl" fontWeight="bold">
                                {nft.metadata.name}
                            </Text>
                            <Text>Equipped: {equipped}</Text>

                            {/* 數量選擇器 */}
                            <Flex align="center" gap={2}>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                >
                                    -
                                </Button>
                                <Input
                                    size="sm"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        handleQuantityChange(isNaN(value) ? 1 : value);
                                    }}
                                    width="60px"
                                    textAlign="center"
                                />
                                <Button
                                    size="sm"
                                    colorScheme="green"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                >
                                    +
                                </Button>
                            </Flex>
                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={async (contract) => {
                                    try {
                                        await contract.call("withdraw", [tokenId, quantity]);
                                    } catch (error) {
                                        console.error("Withdraw failed:", error);
                                    }
                                }}
                            >
                                Unequip {quantity}
                            </Web3Button>
                        </Stack>
                    </Flex>

                    {/* 分隔線 */}
                    <Divider my={4} />

                    {/* 底部按鈕與資訊 */}
                    <Box textAlign="center">
                        <Text fontSize="lg" fontWeight="medium">
                            Claimable $CARROT:
                        </Text>
                        <Text fontSize="md">{rewards}</Text>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS}
                            action={async (contract) => {
                                try {
                                    await contract.call("claimRewards", [tokenId]);
                                } catch (error) {
                                    console.error("Claim rewards failed:", error);
                                }
                            }}
                        >
                            Claim $CARROT
                        </Web3Button>
                    </Box>
                </Card>
            )}
        </Box>
    );
};