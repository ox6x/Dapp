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
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    Divider,
    VStack,
    Card,
} from "@chakra-ui/react";
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
        <Flex direction="column" align="center" p={4}>
            {nft && (
                <Card
                    maxWidth="350px"
                    width="100%"
                    p={4}
                    shadow="lg"
                    borderRadius="md"
                    bg="white"
                >
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
                        <Heading as="h2" size="md" textAlign="center">
                            {nft.metadata.name}
                        </Heading>

                        {/* Equipped 信息 */}
                        <Text fontSize="md" textAlign="center">
                            Equipped: {equipped}
                        </Text>

                        {/* 数量选择器 */}
                        <Flex align="center" gap={2} justify="center">
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

                        <Divider my={4} />

                        {/* Claimable rewards */}
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
                    </VStack>
                </Card>
            )}
        </Flex>
    );
};