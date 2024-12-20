import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import {
  Text,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Box,
} from "@chakra-ui/react";
import Slider from "react-slick";
import NFT from "./NFT";

export default function Store() {
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data: nfts } = useNFTs(contract);

  // 配置 Slick 的輪播設置
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // 一次顯示一個 NFT
    slidesToScroll: 1,
    autoplay: true, // 自動播放
    autoplaySpeed: 3000, // 每 3 秒切換
  };

  return (
    <Container maxW={"1200px"} mt={5}>
      {/* Header Section */}
      <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Link href="/">
          <Button>Back</Button>
        </Link>
      </Flex>

      {/* Store Heading */}
      <Heading mt={5}>Store</Heading>
      <Text>Purchase tools with $CARROTS to increase your earnings.</Text>

      {/* NFT Carousel */}
      {!nfts ? (
        <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      ) : (
        <Box mt={10}>
          <Slider {...sliderSettings}>
            {nfts?.map((nftItem) => (
              <Box key={nftItem.metadata.id} p={5}>
                <NFT nft={nftItem} />
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </Container>
  );
}