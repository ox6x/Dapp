import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex } from "@chakra-ui/react";

interface EquippedProps {
    tokenId: number;
}

const TOOLS_ADDRESS = "0x605f710b66Cc10A0bc0DE7BD8fe786D5C9719179"; // 工具合约地址
const STAKING_ADDRESS = "0x8fCE5853B5228093Ab14df76a5a87e60971de989"; // 质押合约地址

export const DrawerEquippedNFT = (props: EquippedProps) => {
    const address = useAddress();

    const { contract: toolContract } = useContract(TOOLS_ADDRESS); // 使用工具合约地址
    const { data: nft } = useNFT(toolContract, props.tokenId);

    const { contract: stakingContract } = useContract(STAKING_ADDRESS); // 使用质押合约地址

    const { data: claimableRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [props.tokenId, address]
    );

    return (
        <Box>
            {nft && (
                <Card p={5}>
                    <Flex>
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="80%"
                                width="80%"
                            />
                        </Box>
                        <Stack spacing={1}>
                            <Text fontSize={"2xl"} fontWeight={"bold"}>
                                {nft.metadata.name}
                            </Text>
                            <Text>
                                Equipped:{" "}
                                {ethers.utils.formatUnits(claimableRewards?.[0] || 0, 0)}
                            </Text>
                        </Stack>
                    </Flex>
                    <Box mt={5}>
                        <Text>Claimable $CARROT:</Text>
                        <Text>
                            {ethers.utils.formatUnits(claimableRewards?.[1] || 0, 18)}
                        </Text>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS}
                            action={(contract) => contract.call("claimRewards", [props.tokenId])}
                        >
                            Claim $CARROT
                        </Web3Button>
                    </Box>
                </Card>
            )}
        </Box>
    );
};