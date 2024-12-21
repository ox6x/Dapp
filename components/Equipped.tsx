import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack } from "@chakra-ui/react";

interface EquippedProps {
    tokenId: number;
};

export const Equipped = (props: EquippedProps) => {
    const address = useAddress();

    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { data: nft } = useNFT(toolContract, props.tokenId);

    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    const { data: claimableRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [props.tokenId, address]
    );

    return (
        <Box>
            {nft && (
                <Card p={5}>
                    <Stack spacing={4} align="center">
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="80%"
                                width="80%"
                            />
                        </Box>
                        <Stack spacing={1} textAlign="center">
                            <Text fontSize={"2xl"} fontWeight={"bold"}>{nft.metadata.name}</Text>
                            <Text>Equipped: {ethers.utils.formatUnits(claimableRewards[0], 0)}</Text>
                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={(contract) => contract.call("withdraw", [props.tokenId, 1])}
                            >
                                Unequip
                            </Web3Button>
                        </Stack>
                        <Box mt={5} textAlign="center">
                            <Text>Claimable $CARROT:</Text>
                            <Text>{ethers.utils.formatUnits(claimableRewards[1], 18)}</Text>
                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={(contract) => contract.call("claimRewards", [props.tokenId])}
                            >
                                Claim $CARROT
                            </Web3Button>
                        </Box>
                    </Stack>
                </Card>
            )}
        </Box>
    )
};