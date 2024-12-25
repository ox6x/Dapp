import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex } from "@chakra-ui/react";

interface EquippedProps {
    tokenId: number;
}

const TOOLS_ADDRESS_V1 = "0x605f710b66Cc10A0bc0DE7BD8fe786D5C9719179";
const STAKING_ADDRESS_V1 = "0x8fCE5853B5228093Ab14df76a5a87e60971de989";
const TOOLS_ADDRESS_V2 = "0x605f710b66Cc10A0bc0DE7BD8fe786D5C9719179";
const STAKING_ADDRESS_V2 = "0x8fCE5853B5228093Ab14df76a5a87e60971de989";

export const DrawerEquippedNFT = (props: EquippedProps) => {
    const address = useAddress();

    // 合约实例
    const { contract: toolContractV1 } = useContract(TOOLS_ADDRESS_V1);
    const { contract: toolContractV2 } = useContract(TOOLS_ADDRESS_V2);
    const { contract: stakingContractV1 } = useContract(STAKING_ADDRESS_V1);
    const { contract: stakingContractV2 } = useContract(STAKING_ADDRESS_V2);

    // NFT 数据
    const { data: nftV1 } = useNFT(toolContractV1, props.tokenId);
    const { data: nftV2 } = useNFT(toolContractV2, props.tokenId);

    // 可领取奖励数据
    const { data: claimableRewardsV1 } = useContractRead(
        stakingContractV1,
        "getStakeInfoForToken",
        [props.tokenId, address]
    );
    const { data: claimableRewardsV2 } = useContractRead(
        stakingContractV2,
        "getStakeInfoForToken",
        [props.tokenId, address]
    );

    return (
        <Box>
            {/* 显示工具合约V1相关信息 */}
            {nftV1 && (
                <Card p={5} mb={5}>
                    <Flex>
                        <Box>
                            <MediaRenderer
                                src={nftV1.metadata.image}
                                height="80%"
                                width="80%"
                            />
                        </Box>
                        <Stack spacing={1}>
                            <Text fontSize={"2xl"} fontWeight={"bold"}>
                                {nftV1.metadata.name} (V1)
                            </Text>
                            <Text>
                                Equipped:{" "}
                                {ethers.utils.formatUnits(claimableRewardsV1?.[0] || 0, 0)}
                            </Text>
                        </Stack>
                    </Flex>
                    <Box mt={5}>
                        <Text>Claimable $CARROT (V1):</Text>
                        <Text>
                            {ethers.utils.formatUnits(claimableRewardsV1?.[1] || 0, 18)}
                        </Text>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS_V1}
                            action={(contract) => contract.call("claimRewards", [props.tokenId])}
                        >
                            Claim $CARROT (V1)
                        </Web3Button>
                    </Box>
                </Card>
            )}

            {/* 显示工具合约V2相关信息 */}
            {nftV2 && (
                <Card p={5}>
                    <Flex>
                        <Box>
                            <MediaRenderer
                                src={nftV2.metadata.image}
                                height="80%"
                                width="80%"
                            />
                        </Box>
                        <Stack spacing={1}>
                            <Text fontSize={"2xl"} fontWeight={"bold"}>
                                {nftV2.metadata.name} (V2)
                            </Text>
                            <Text>
                                Equipped:{" "}
                                {ethers.utils.formatUnits(claimableRewardsV2?.[0] || 0, 0)}
                            </Text>
                        </Stack>
                    </Flex>
                    <Box mt={5}>
                        <Text>Claimable $CARROT (V2):</Text>
                        <Text>
                            {ethers.utils.formatUnits(claimableRewardsV2?.[1] || 0, 18)}
                        </Text>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS_V2}
                            action={(contract) => contract.call("claimRewards", [props.tokenId])}
                        >
                            Claim $CARROT (V2)
                        </Web3Button>
                    </Box>
                </Card>
            )}
        </Box>
    );
};