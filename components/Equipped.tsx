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
import { Box, Text, VStack, HStack, Button, Input, Divider, Flex } from "@chakra-ui/react";
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
        <Flex
            p={4}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            shadow="md"
            my={4}
            alignItems="center"
            width="100%" // 每个NFT占据一行的宽度
        >
            {/* 左侧 NFT 图片 */}
            <Box flexShrink={0} mr={4}>
                <MediaRenderer
                    src={nft?.metadata.image}
                    height="120px"
                    width="120px"
                    style={{ borderRadius: "10px" }}
                />
            </Box>

            {/* 右侧 NFT 信息和功能 */}
            <VStack align="start" spacing={4} flex={1}>
                {/* NFT 名称 */}
                <Text fontSize="xl" fontWeight="bold">
                    {nft?.metadata.name}
                </Text>

                {/* Equipped 信息 */}
                <Text fontSize="md">
                    <strong>Equipped:</strong> {equipped}
                </Text>

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

                {/* 操作按钮 */}
                <Flex gap={2} flexWrap="wrap">
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
                </Flex>
            </VStack>
        </Flex>
    );
};

export const EquippedList = ({ tokenIds }: { tokenIds: number[] }) => {
    return (
        <Flex
            direction="row" // 水平方向排列
            wrap="wrap" // 自动换行
            justify="center" // 水平居中对齐
            gap={4} // 设置NFT之间的间距
            p={4} // 设置整体内边距
        >
            {tokenIds.map((tokenId) => (
                <Box key={tokenId} width="100%"> {/* 每个NFT占满整行 */}
                    <Equipped tokenId={tokenId} />
                </Box>
            ))}
        </Flex>
    );
};