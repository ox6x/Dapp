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
        slidesToShow: 1, // Show one slide at a time
        slidesToScroll: 1,
        autoplay: false, // Disable autoplay
        centerMode: true, // Enable centering
        centerPadding: "0", // Ensure content is fully centered
    };

    return (
        <Container maxW={"1200px"}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Link href="/">
                    <Button>Back</Button>
                </Link>
            </Flex>
            <Heading mt={"40px"}>Supplier</Heading>
            <Text>
                Boost your earnings with exclusive tools that unlock unique advantages and free up your hands!
            </Text>
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