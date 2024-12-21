import { MediaRenderer, Web3Button, useAddress, useContract } from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import { Text, Box, Button, Card, SimpleGrid, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router'; // Import useRouter for programmatic navigation

type Props = {
    nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);
    const router = useRouter(); // Initialize router

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
    }

    if (nft?.length === 0) {
        return (
            <Box textAlign="center" mt={10}>
                <Text mb={4}>No tools available.</Text>
                <Button
                    colorScheme="teal"
                    onClick={() => router.push('/store')} // Navigate programmatically
                >
                    Go to Store
                </Button>
            </Box>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
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