import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Text, Button, Container, Flex, Heading, Spinner, Box } from "@chakra-ui/react";
import NFT from "../components/NFT";

export default function Store() {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data: nfts } = useNFTs(contract);
    console.log(nfts);

    // Slider settings for react-slick
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1, // Show one slide at a time
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "30px", // Adds some padding to center the slides
        autoplay: false, // Disable auto-play
    };

    return (
        <Container maxW={"1200px"} py={6}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Link href="/">
                    <Button>Back</Button>
                </Link>
            </Flex>
            <Heading mt={10}>Shop</Heading>
            <Text mb={6}>Purchase tools with $CARROTS to increase your earnings.</Text>

            {!nfts ? (
                <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
                    <Spinner />
                </Flex>
            ) : (
                <Box>
                    <Slider {...sliderSettings}>
                        {nfts?.map((nftItem) => (
                            <Box key={nftItem.metadata.id} p={4}>
                                <NFT nft={nftItem} />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            )}
        </Container>
    );
}