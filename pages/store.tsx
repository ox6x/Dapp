import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import { Text, Button, Container, Flex, Heading, Spinner } from "@chakra-ui/react";
import NFT from "../components/NFT";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Store() {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data: nfts } = useNFTs(contract);
    console.log(nfts);

    // Slick slider settings
    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0px",
        autoplay: false,
    };

    return (
        <Container maxW={"1200px"}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Link href="/">
                    <Button>Back</Button>
                </Link>
            </Flex>
            <Heading mt={"40px"} textAlign={"center"}>Shop</Heading>
            <Text textAlign={"center"}>Purchase tools with $CARROTS to increase your earnings.</Text>
            {!nfts ? (
                <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
                    <Spinner />
                </Flex>
            ) : (
                <Flex justifyContent={"center"} mt={10}>
                    <Slider {...sliderSettings} style={{ width: "80%" }}>
                        {nfts.map((nftItem) => (
                            <Flex key={nftItem.metadata.id} justifyContent={"center"}>
                                <NFT nft={nftItem} />
                            </Flex>
                        ))}
                    </Slider>
                </Flex>
            )}
        </Container>
    );
};