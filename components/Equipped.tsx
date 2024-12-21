import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

    // Slider settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <Box>
            {nft && (
                <Card p={5}>
                    <Slider {...sliderSettings}>
                        <Box>
                            <Flex>
                                <Box>
                                    <MediaRenderer
                                        src={nft.metadata.image}
                                        height="80%"
                                        width="80%"
                                    />
                                </Box>
                                <Stack spacing={1}>
                                    <Text fontSize={"2xl"} fontWeight={"bold"}>{nft.metadata.name}</Text>
                                    <Text>Equipped: {ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0)}</Text>
                                    <Web3Button
                                        contractAddress={STAKING_ADDRESS}
                                        action={(contract) => contract.call("withdraw", [props.tokenId, 1])}
                                    >Unequip</Web3Button>
                                </Stack>
                            </Flex>
                        </Box>

                        <Box>
                            <Text>Claimable $CARROT:</Text>
                            <Text>{ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18)}</Text>
                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={(contract) => contract.call("claimRewards", [props.tokenId])}
                            >Claim $CARROT</Web3Button>
                        </Box>
                    </Slider>
                </Card>
            )}
        </Box>
    )
};