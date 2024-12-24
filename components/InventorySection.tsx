import { MediaRenderer, useAddress, useContract } from '@thirdweb-dev/react';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import Link from 'next/link';
import { Text, Box, Button, Card, SimpleGrid, Stack, Flex, Heading, Skeleton } from '@chakra-ui/react';
import Quantity from './Quantity'; // 引入动态数量选择器组件
import styles from './InventorySection.module.scss';

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
            const isApproved = await toolContract?.erc1155.isApproved(address, STAKING_ADDRESS);

            // 如果未授权，先设置授权
            if (!isApproved) {
                await toolContract?.erc1155.setApprovalForAll(STAKING_ADDRESS, true);
            }

            // 调用 stake 方法
            await stakingContract?.call("stake", [id, quantity]);
            console.log(`Staked ${quantity} of token ID ${id}.`);
        } catch (error) {
            console.error("Error staking NFT:", error);
        }
    };

    return (
        <Box className={styles.inventorySection} p={4}>
            <Card className={styles.card} p={6}>
                <Heading className={styles.heading} mb={4}>
                    Locker
                </Heading>
                <Skeleton isLoaded={!loadingOwnedTools}>
                    {ownedTools?.length === 0 ? (
                        <Box textAlign="center" p={6}>
                            <Text fontSize="lg" fontWeight="medium" mb={4}>
                                No tools available.
                            </Text>
                            <Link href="/shop">
                                <Button
                                    colorScheme="blue"
                                    variant="solid"
                                    className={styles.shopButton}
                                >
                                    Shop Tools
                                </Button>
                            </Link>
                        </Box>
                    ) : (
                        <SimpleGrid columns={[1, 2, 3]} spacing={6} className={styles.toolsGrid}>
                            {ownedTools?.map((nft: any) => (
                                <Card 
                                    key={nft.metadata.id} 
                                    className={styles.toolCard}
                                    p={4}
                                    shadow="md"
                                    borderRadius="lg"
                                >
                                    <Stack align="center" spacing={4}>
                                        {/* NFT 图片 */}
                                        <MediaRenderer 
                                            src={nft.metadata.image} 
                                            alt={nft.metadata.name || "Tool Image"}
                                            className={styles.toolMedia}
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        
                                        {/* 名称和数量 */}
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            w="full"
                                            className={styles.toolInfo}
                                        >
                                            <Text fontSize="md" fontWeight="bold">
                                                {nft.metadata.name}
                                            </Text>
                                            <Text color="gray.500" fontSize="sm">
                                                ({nft.supply?.toString() || "0"})
                                            </Text>
                                        </Flex>

                                        {/* 动态选择器 */}
                                        <Quantity
                                            minQuantity={1}
                                            onQuantityChange={(quantity) => handleOnClick(nft.metadata.id, quantity)}
                                            buttonText="On"
                                            className={styles.quantityButton}
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