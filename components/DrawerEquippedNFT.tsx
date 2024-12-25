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

    // 合約實例
    const { contract: toolContractV1 } = useContract(TOOLS_ADDRESS_V1);
    const { contract: toolContractV2 } = useContract(TOOLS_ADDRESS_V2);
    const { contract: stakingContractV1 } = useContract(STAKING_ADDRESS_V1);
    const { contract: stakingContractV2 } = useContract(STAKING_ADDRESS_V2);

    // NFT 資料
    const { data: nftV1 } = useNFT(toolContractV1, props.tokenId);
    const { data: nftV2 } = useNFT(toolContractV2, props.tokenId);

    // 可領取獎勵資料
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

    // Helper function to render NFT card
    const renderNFTCard = (nft: any, rewards: any, version: string, stakingAddress: string) => (
        <Card p={5} mb={5}>
            <Flex>
                <Box>
                    <MediaRenderer
                        src={nft.metadata?.image || ""}
                        height="80%"
                        width="80%"
                    />
                </Box>
                <Stack spacing={1}>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {nft.metadata?.name || "Unnamed NFT"} ({version})
                    </Text>
                    <Text>
                        Equipped: {ethers.utils.formatUnits(rewards?.[0] || 0, 0)}
                    </Text>
                </Stack>
            </Flex>
            <Box mt={5}>
                <Text>Token:</Text>
                <Text>
                    {ethers.utils.formatUnits(rewards?.[1] || 0, 18)}
                </Text>
                <Web3Button
                    contractAddress={stakingAddress}
                    action={(contract) => contract.call("claimRewards", [props.tokenId])}
                >
                    Claim
                </Web3Button>
            </Box>
        </Card>
    );

    return (
        <Box>
            {/* 渲染工具合約 V1 相關資訊 */}
            {nftV1 && claimableRewardsV1?.[0] && ethers.utils.formatUnits(claimableRewardsV1?.[0], 0) !== "0" && (
                renderNFTCard(nftV1, claimableRewardsV1, "V1", STAKING_ADDRESS_V1)
            )}

            {/* 渲染工具合約 V2 相關資訊 */}
            {nftV2 && claimableRewardsV2?.[0] && ethers.utils.formatUnits(claimableRewardsV2?.[0], 0) !== "0" && (
                renderNFTCard(nftV2, claimableRewardsV2, "V2", STAKING_ADDRESS_V2)
            )}

            {/* 提示用戶沒有符合條件的 NFT */}
            {!nftV1 && !nftV2 && <Text>No NFTs with rewards available.</Text>}
        </Box>
    );
};