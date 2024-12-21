import { MediaRenderer, Web3Button, useAddress, useContract } from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import Store from './Store'; // 確保 Store 的路徑正確
import { Text, Box, Button, Card, SimpleGrid, Stack } from '@chakra-ui/react';

type Props = {
    nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

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
            <Box>
                <Text>No tools.</Text>
                <Box mt={5}>
                    <Store /> {/* 直接嵌入 Store 組件 */}
                </Box>
            </Box>
        );
    }

    return (
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
    );
};