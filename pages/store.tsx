import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import { Text, Button, Container, Flex, Heading, Spinner } from "@chakra-ui/react";
import NFTComponent from "../components/NFT"; // 引入 NFT 组件
import { useState } from "react";

export default function Store() {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data: nfts } = useNFTs(contract);

    const [totalPrices, setTotalPrices] = useState<{ [key: string]: string }>({}); // 存储每个 NFT 的总价

    const handleTotalPriceChange = (nftId: string, totalPrice: string) => {
        setTotalPrices((prev) => ({
            ...prev,
            [nftId]: totalPrice,
        }));
    };

    // 汇总所有 NFT 的总价
    const grandTotal = Object.values(totalPrices).reduce((sum, price) => sum + parseFloat(price), 0);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true,
        centerPadding: "0",
    };

    return (
        <Container maxW={"1200px"}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Link href="/">
                    <Button>Back</Button>
                </Link>
            </Flex>
            <Heading mt={"40px"}>Store</Heading>
            <Text>Purchase tools with $CARROTS to increase your earnings.</Text>
            {!nfts ? (
                <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
                    <Spinner />
                </Flex>
            ) : (
                <Slider {...sliderSettings}>
                    {nfts?.map((nftItem) => (
                        <div key={nftItem.metadata.id}>
                            <NFTComponent
                                nft={nftItem}
                                onTotalPriceChange={handleTotalPriceChange} // 传递回调函数
                            />
                        </div>
                    ))}
                </Slider>
            )}
            {/* 显示总价 */}
            <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"} mt={5}>
                Grand Total: {grandTotal.toFixed(2)} CARROTS
            </Text>
        </Container>
    );
}