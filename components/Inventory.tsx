import { MediaRenderer, useAddress, useContract } from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import Link from 'next/link';
import { Text, Box, Button, Card, SimpleGrid, Stack } from '@chakra-ui/react';
import NFTQuantityTransaction from './NFTQuantityTransaction'; // 引入数量选择组件
import { useEffect, useState } from 'react';

type Props = {
    nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);
    const [balances, setBalances] = useState<Record<string, string>>({}); // 用来存储每个 NFT 的数量

    // 获取用户持有的 NFT 数量
    useEffect(() => {
        async function fetchBalances() {
            if (!address || !toolContract || !nft) return;

            const newBalances: Record<string, string> = {};
            for (const nftItem of nft) {
                const balance = await toolContract?.erc1155.balanceOf(
                    address,
                    nftItem.metadata.id
                );
                newBalances[nftItem.metadata.id] = balance?.toString() || "0";
            }
            setBalances(newBalances);
        }

        fetchBalances();
    }, [address, toolContract, nft]);

    // 处理装备逻辑
    async function equipNFT(id: string, quantity: number) {
        if (!address) {
            return;
        }

        const isApproved = await toolContract?.erc1155.isApproved(
            address,
            STAKING_ADDRESS,
        );

        if (!isApproved) {
            await toolContract?.erc1155.setApprovalForAll(
                STAKING_ADDRESS,
                true,
            );
        }
        await stakingContract?.call("stake", [id, quantity]); // 根据数量装备
        alert(`Successfully equipped ${quantity} NFTs!`);
    }

    if (nft?.length === 0) {
        return (
            <Box>
                <Text>No tools.</Text>
                <Link href="/store">
                    <Button>Shop Tool</Button>
                </Link>
            </Box>
        );
    }

    return (
        <SimpleGrid columns={3} spacing={4}>
            {nft?.map((nftItem) => (
                <Card key={nftItem.metadata.id} p={5}>
                    <Stack alignItems={"center"}>
                        <MediaRenderer 
                            src={nftItem.metadata.image} 
                            height="100px"
                            width="100px"
                        />
                        <Text>{nftItem.metadata.name}</Text>
                        {/* 显示用户持有数量 */}
                        <Text>
                            Owned:{" "}
                            <Text as="span" fontWeight="bold">
                                {balances[nftItem.metadata.id] || "0"}
                            </Text>
                        </Text>
                        {/* 使用 NFTQuantityTransaction 组件 */}
                        <NFTQuantityTransaction
                            initialQuantity={1}
                            onTransaction={(quantity) => equipNFT(nftItem.metadata.id, quantity)}
                            getPrice={() => "Free"} // 如果没有价格概念，可以写固定值
                            onTransactionConfirmed={() => alert("Equipment confirmed!")}
                        />
                    </Stack>
                </Card>
            ))}
        </SimpleGrid>
    );
}