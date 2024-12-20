import React, { useState } from "react";
import Slider from "react-slick";
import {
    MediaRenderer,
    Web3Button,
    useAddress,
    useContract,
    useContractRead,
    useNFT
} from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Box, Card, Stack, Flex, Text } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface EquippedProps {
    tokenId: number;
    nftArray: { id: number; image: string; name: string }[];
}

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

    const [quantity, setQuantity] = useState<number>(1);

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(Math.max(1, newQuantity));
    };

    // Slider settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <Box>
            {/* 外部容器添加樣式 */}
            <Box maxWidth="80%" margin="0 auto">
                <Slider {...sliderSettings}>
                    {props.nftArray.map((nftItem) => (
                        <Box
                            key={nftItem.id}
                            maxWidth="300px"
                            maxHeight="300px"
                            overflow="hidden"
                            borderRadius="10px"
                            padding="10px"
                            bgColor="white"
                        >
                            <MediaRenderer
                                src={nftItem.image}
                                height="100%"
                                width="100%"
                                style={{ objectFit: "contain" }}
                            />
                            <Text fontWeight="bold" textAlign="center" mt={2}>
                                {nftItem.name}
                            </Text>
                        </Box>
                    ))}
                </Slider>
            </Box>

            {nft && (
                <Card p={5} mt={5}>
                    <Flex>
                        <Box
                            maxWidth="300px"
                            maxHeight="300px"
                            overflow="hidden"
                            borderRadius="10px"
                        >
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="100%"
                                width="100%"
                                style={{ objectFit: "contain" }}
                            />
                        </Box>
                        <Stack spacing={3} ml={5}>
                            <Text fontSize="2xl" fontWeight="bold">
                                {nft.metadata.name}
                            </Text>
                            <Text>
                                Equipped: {ethers.utils.formatUnits(claimableRewards[0], 0)}
                            </Text>
                            <Flex align="center" gap={2}>
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#f56565",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        handleQuantityChange(isNaN(value) ? 1 : value);
                                    }}
                                    style={{
                                        width: "60px",
                                        textAlign: "center",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        padding: "5px",
                                    }}
                                />
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#48bb78",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    +
                                </button>
                            </Flex>
                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={(contract) => contract.call("withdraw", [props.tokenId, quantity])}
                            >
                                Unequip {quantity}
                            </Web3Button>
                        </Stack>
                    </Flex>
                    <Box mt={5}>
                        <Text>Claimable $CARROT:</Text>
                        <Text>{ethers.utils.formatUnits(claimableRewards[1], 18)}</Text>
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