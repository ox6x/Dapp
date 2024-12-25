import {
    MediaRenderer,
    Web3Button,
    useAddress,
    useContract,
    useContractRead,
    useNFT,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex, VStack, Heading } from "@chakra-ui/react";

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
        <VStack spacing={5} align="stretch" p={5}>
            {/* 显示工具合约V1相关信息 */}
            {nftV1 && (
                <Card p={5} shadow="md" borderRadius="lg">
                    <Flex direction={{ base: "column", md: "row" }} align="center" gap={5}>
                        <Box flex="0 0 auto">
                            <MediaRenderer
                                src={nftV1.metadata.image}
                                height="100%"
                                width="100%"
                                style={{ maxWidth: "150px", borderRadius: "8px" }}
                            />
                        </Box>
                        <VStack align="start" spacing={3} flex="1">
                            <Heading size="md">{nftV1.metadata.name} (V1)</Heading>
                            <Text fontSize="lg" color="gray.600">
                                Token Rewards:{" "}
                                <Text as="span" fontWeight="bold">
                                    {ethers.utils.formatUnits(claimableRewardsV1?.[1] || 0, 18)}
                                </Text>
                            </Text>
                            <Web3Button
                                contractAddress={STAKING_ADDRESS_V1}
                                action={(contract) => contract.call("claimRewards", [props.tokenId])}
                                mt={3}
                            >
                                Claim Rewards
                            </Web3Button>
                        </VStack>
                    </Flex>
                </Card>
            )}

            {/* 显示工具合约V2相关信息 */}
            {nftV2 && (
                <Card p={5} shadow="md" borderRadius="lg">
                    <Flex direction={{ base: "column", md: "row" }} align="center" gap={5}>
                        <Box flex="0 0 auto">
                            <MediaRenderer
                                src={nftV2.metadata.image}
                                height="100%"
                                width="100%"
                                style={{ maxWidth: "150px", borderRadius: "8px" }}
                            />
                        </Box>
                        <VStack align="start" spacing={3} flex="1">
                            <Heading size="md">{nftV2.metadata.name} (V2)</Heading>
                            <Text fontSize="lg" color="gray.600">
                                Token Rewards:{" "}
                                <Text as="span" fontWeight="bold">
                                    {ethers.utils.formatUnits(claimableRewardsV2?.[1] || 0, 18)}
                                </Text>
                            </Text>
                            <Web3Button
                                contractAddress={STAKING_ADDRESS_V2}
                                action={(contract) => contract.call("claimRewards", [props.tokenId])}
                                mt={3}
                            >
                                Claim Rewards
                            </Web3Button>
                        </VStack>
                    </Flex>
                </Card>
            )}
        </VStack>
    );
};