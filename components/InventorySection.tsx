import { MediaRenderer, useAddress, useContract } from '@thirdweb-dev/react';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import Link from 'next/link';
import { Text, Box, Button, Card, SimpleGrid, Stack, Flex, Heading, Skeleton } from '@chakra-ui/react';
import Quantity from './Quantity'; // 引入动态数量选择器组件

const InventorySection = ({ ownedTools, loadingOwnedTools }: any) => {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    const handleOnClick = async (id: string, quantity: number) => {
        if (!address) {
            console.error("No wallet connected.");
            return;
        }

        try {
            // 检查是否已经授权
            const isApproved = await toolContract?.erc1155.isApproved(
                address,
                STAKING_ADDRESS,
            );

            // 如果未授权，先设置授权
            if (!isApproved) {
                await toolContract?.erc1155.setApprovalForAll(
                    STAKING_ADDRESS,
                    true,
                );
            }

            // 调用 stake 方法
            await stakingContract?.call("stake", [id, quantity]);
            console.log(`Staked ${quantity} of token ID ${id}.`);
        } catch (error) {
            console.error("Error staking NFT:", error);
        }
    };

    return (
        <Box mb={6}>
            <Card p={4}>
                <Heading fontSize="lg" mb={4}>
                    Locker
                </Heading>
                <Skeleton isLoaded={!loadingOwnedTools}>
                    {ownedTools?.length === 0 ? (
                        <Box textAlign="center" mt={10}>
                            <Text fontSize="lg" color="gray.600">No tools available.</Text>
                            <Link href="/shop">
                                <Button mt={4} colorScheme="blue">Shop Tools</Button>
                            </Link>
                        </Box>
                    ) : (
                        <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={6}>
                            {ownedTools?.map((nft: any) => (
                                <Card 
                                    key={nft.metadata.id} 
                                    p={5} 
                                    borderRadius="md" 
                                    boxShadow="md"
                                    _hover={{ boxShadow: "lg" }}
                                >
                                    <Stack align="center" spacing={4}>
                                        {/* 显示 NFT 图片 */}
                                        <MediaRenderer 
                                            src={nft.metadata.image} 
                                            height="120px"
                                            width="120px"
                                            style={{ borderRadius: "8px" }}
                                        />
                                        
                                        {/* 名稱和數量 */}
                                        <Flex align="center" gap={2}>
                                            <Text fontSize="md" fontWeight="bold">
                                                {nft.metadata.name}
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                ({nft.supply?.toString() || "0"})
                                            </Text>
                                        </Flex>

                                        {/* 动态选择器，整合 Equip 功能 */}
                                        <Quantity
                                            minQuantity={1}
                                            onQuantityChange={(quantity) => handleOnClick(nft.metadata.id, quantity)}
                                            buttonText="On"
                                        />
                                    </Stack>
                                </Card>
                            ))}
                        </SimpleGrid>
                    )}
                </Skeleton>
            </Card>
        </Box>
    );
};

export default InventorySection;