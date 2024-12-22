import { MediaRenderer, useAddress, useContract } from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import Link from 'next/link';
import { Text, Box, Button, Card, SimpleGrid, Stack } from '@chakra-ui/react';
import Quantity from './Quantity'; // 引入动态数量选择器组件

type Props = {
    nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
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

    if (nft?.length === 0) {
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
        <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={6}>
            {nft?.map((nft) => (
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
                        
                        {/* 显示 NFT 名称和持有数量 */}
                        <Text fontSize="md" fontWeight="bold">
                            {nft.metadata.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Owned: {nft.supply?.toString() || "0"}
                        </Text>

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
    );
};