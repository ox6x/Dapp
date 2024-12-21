import { useState } from 'react';
import { MediaRenderer, Web3Button, useAddress, useContract } from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import { Text, Box, Button, Card, SimpleGrid, Stack } from '@chakra-ui/react';
import Store from './Store'; // 引入 Store 组件

type Props = {
    nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    // 用于控制是否显示商店
    const [showStore, setShowStore] = useState(false);

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

    if (nft?.length === 0) {
        return (
            <Box textAlign="center" mt={6}>
                <Text fontSize="lg" mb={4}>No tools available.</Text>
                {!showStore ? (
                    <Button colorScheme="teal" onClick={() => setShowStore(true)}>
                        Shop Tool
                    </Button>
                ) : (
                    <Box mt={6}>
                        <Store />
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Box>
            <SimpleGrid columns={3} spacing={4}>
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

            {/* 显示商店内容按钮 */}
            <Box mt={6} textAlign="center">
                {!showStore ? (
                    <Button colorScheme="teal" onClick={() => setShowStore(true)}>
                        Shop More Tools
                    </Button>
                ) : (
                    <Box mt={6}>
                        <Store />
                    </Box>
                )}
            </Box>
        </Box>
    );
};