import { MediaRenderer, useAddress, useContract } from "@thirdweb-dev/react";
import { getStakingAddress, getToolsAddress } from "../const/addresses"; // 动态获取地址
import Link from "next/link";
import { Text, Box, Button, Card, SimpleGrid, Stack, Flex, Heading, Skeleton } from "@chakra-ui/react";
import Quantity from "./Quantity";

const InventorySection = ({ ownedTools, loadingOwnedTools }: any) => {
    const address = useAddress();
    const stakingAddress = getStakingAddress(); // 动态获取 Staking 地址
    const toolsAddress = getToolsAddress(); // 动态获取 Tools 地址

    const { contract: toolContract } = useContract(toolsAddress);
    const { contract: stakingContract } = useContract(stakingAddress);

    const handleOnClick = async (id: string, quantity: number) => {
        if (!address) {
            console.error("No wallet connected.");
            return;
        }

        if (!toolContract || !stakingContract) {
            console.error("Contracts not initialized.");
            return;
        }

        try {
            const isApproved = await toolContract.erc1155.isApproved(address, stakingAddress); // 使用动态地址
            if (!isApproved) {
                await toolContract.erc1155.setApprovalForAll(stakingAddress, true); // 使用动态地址
            }

            await stakingContract.call("stake", [id, quantity]);
            console.log(`Staked ${quantity} of token ID ${id}.`);
        } catch (error: any) {
            console.error("Error staking NFT:", error);
            alert(`Error staking NFT: ${error.message || "Unknown error occurred."}`);
        }
    };

    if (!ownedTools || !Array.isArray(ownedTools)) {
        return (
            <Box textAlign="center" mt={10}>
                <Text fontSize="lg" color="gray.600">No tools available.</Text>
                <Link href="/shop">
                    <Button mt={4} colorScheme="blue">Shop Tools</Button>
                </Link>
            </Box>
        );
    }

    return (
        <Box mb={6}>
            <Card p={4}>
                <Heading fontSize="lg" mb={4}>
                    Locker
                </Heading>
                <Skeleton isLoaded={!loadingOwnedTools && ownedTools.length > 0}>
                    <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={6}>
                        {ownedTools.map((nft: any) => (
                            <Card 
                                key={nft.metadata.id} 
                                p={5} 
                                borderRadius="md" 
                                boxShadow="md"
                                _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
                                cursor="pointer"
                            >
                                <Stack align="center" spacing={4}>
                                    <MediaRenderer 
                                        src={nft.metadata.image} 
                                        height="120px"
                                        width="120px"
                                        style={{ borderRadius: "8px" }}
                                    />
                                    <Flex align="center" gap={2}>
                                        <Text fontSize="md" fontWeight="bold">
                                            {nft.metadata.name}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            ({nft.supply?.toString() || "0"})
                                        </Text>
                                    </Flex>
                                    <Quantity
                                        minQuantity={1}
                                        onQuantityChange={(quantity) => {
                                            if (quantity > 0) {
                                                handleOnClick(nft.metadata.id, quantity);
                                            }
                                        }}
                                        buttonText="On"
                                    />
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Skeleton>
            </Card>
        </Box>
    );
};

export default InventorySection;