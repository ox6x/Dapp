import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex } from "@chakra-ui/react";

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
                    <Flex alignItems="center">
                        {/* 圖片區域 */}
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="150px"
                                width="150px"
                            />
                            <Text fontSize="lg" fontWeight="bold" textAlign="center" mt={2}>
                                {nft.metadata.name}
                            </Text>
                        </Box>

                        {/* 按鈕及屬性區域 */}
                        <Flex flex={1} justifyContent="space-between" ml={5}>
                            {/* 按鈕區域 */}
                            <Stack spacing={3} justifyContent="center">
                                <Web3Button
                                    contractAddress={STAKING_ADDRESS}
                                    action={(contract) => contract.call("withdraw", [props.tokenId, 1])}
                                >
                                    Unequip
                                </Web3Button>
                                <Web3Button
                                    contractAddress={STAKING_ADDRESS}
                                    action={(contract) => contract.call("claimRewards", [props.tokenId])}
                                >
                                    Claim $CARROT
                                </Web3Button>
                            </Stack>

                            {/* 數值屬性區域 */}
                            <Stack spacing={2} textAlign="right">
                                <Text fontSize="md">Equipped:</Text>
                                <Text fontWeight="bold">
                                    {ethers.utils.formatUnits(claimableRewards[0], 0)}
                                </Text>
                                <Text fontSize="md">Claimable $CARROT:</Text>
                                <Text fontWeight="bold">
                                    {ethers.utils.formatUnits(claimableRewards[1], 18)}
                                </Text>
                            </Stack>
                        </Flex>
                    </Flex>
                </Card>
            )}
        </Box>
    )
};