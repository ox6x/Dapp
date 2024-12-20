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
import { Box, Text, VStack, HStack, Button, Input, Divider, Stack } from "@chakra-ui/react";
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
        <Box
            p={4}
            maxW="sm"
            mx="auto"
            bg="gray.50"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            shadow="md"
            my={4}
        >
            {nft && (
                <VStack spacing={4}>
                    {/* NFT 图片 */}
                    <Box>
                        <MediaRenderer
                            src={nft.metadata.image}
                            height="150px"
                            width="150px"
                            style={{ borderRadius: "10px" }}
                        />
                    </Box>

                    {/* NFT 名称 */}
                    <Text fontSize="xl" fontWeight="bold" textAlign="center">
                        {nft.metadata.name}
                    </Text>

                    {/* Equipped 信息 */}
                    <Box>
                        <Text fontSize="md" textAlign="center">
                            Equipped: {equipped}
                        </Text>
                    </Box>

                    {/* 数量选择器 */}
                    <HStack spacing={2}>
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
                    </HStack>

                    {/* Unequip 按钮 */}
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

                    <Divider />

                    {/* Claimable rewards */}
                    <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="medium">
                            Claimable:
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
                            Claim
                        </Web3Button>
                    </VStack>
                </VStack>
            )}
        </Box>
    );
};
