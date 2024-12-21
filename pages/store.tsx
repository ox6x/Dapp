import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import { Text, Button, Container, Flex, Heading, Spinner } from "@chakra-ui/react";
import NFT from "../components/NFT";

export default function Store() {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data: nfts } = useNFTs(contract);
    console.log(nfts);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Container maxW={"1200px"}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Link href="/">
                    <Button>Back</Button>
                </Link>
            </Flex>
            <Heading mt={"40px"}>Shop</Heading>
            <Text>Purchase tools with $CARROTS to increase your earnings.</Text>
            {!nfts ? (
                <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
                    <Spinner />
                </Flex>
            ) : (
                <Slider {...sliderSettings}>
                    {nfts?.map((nftItem) => (
                        <div key={nftItem.metadata.id}>
                            <NFT nft={nftItem} />
                        </div>
                    ))}
                </Slider>
            )}
        </Container>
    );
}