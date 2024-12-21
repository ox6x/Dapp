import { MediaRenderer, Web3Button, useAddress, useContract } from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import { useRouter } from 'next/router'; // 引入 useRouter
import { Text, Box, Button, Card, SimpleGrid, Stack } from '@chakra-ui/react';

type Props = {
    nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);
    const router = useRouter(); // 初始化 useRouter

    async function stakeNFT(id: string) {
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
        await stakingContract?.call("stake", [id, 1]);
    };

    // 如果 NFT 列表為空
    if (nft?.length === 0) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
            >
                <Text fontSize="lg" mb={4}>No tools.</Text>
                <Button
                    onClick={() => router.push("/store")} // 跳轉到 Store 頁面
                    colorScheme="teal"
                >
                    Shop Tool
                </Button>
            </Box>
        );
    }

    // 如果有 NFT
    return (
        <SimpleGrid columns={3} spacing={4} p={5}>
            {nft?.map((nft) => (
                <Card key={nft.metadata.id} p={5}>
                    <Stack alignItems={"center"}>
                        <MediaRenderer 
                            src={nft.metadata.image} 
                            height="100px"
                            width="100px"
                        />
                        <Text>{nft.metadata.name}</Text>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS}
                            action={() => stakeNFT(nft.metadata.id)}
                        >
                            Equip
                        </Web3Button>
                    </Stack>
                </Card>
            ))}
        </SimpleGrid>
    );
};