import { useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import {
  Text,
  Button,
  Container,
  Flex,
  Heading,
  Spinner
} from "@chakra-ui/react";
import NFT from "../components/NFT";

export default function Store() {
  const {
    contract,
    isLoading: contractLoading,
    error: contractError
  } = useContract(TOOLS_ADDRESS);
  const {
    data: nfts,
    isLoading: nftsLoading,
    error: nftsError
  } = useNFTs(contract);

  // 整體是否處於載入中或發生錯誤
  const isLoading = contractLoading || nftsLoading;
  const hasError = contractError || nftsError;

  // 透過 useMemo 避免多次建立同一組 sliderSettings
  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1, 
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: true,
      centerPadding: "0"
    }),
    []
  );

  // 如果載入中，顯示 Spinner
  if (isLoading) {
    return (
      <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
        <Spinner />
      </Flex>
    );
  }

  // 如果發生錯誤，顯示錯誤訊息
  if (hasError) {
    return (
      <Container maxW={"1200px"}>
        <Text color="red.500">
          Oops! Something went wrong while loading NFTs or contract.
        </Text>
      </Container>
    );
  }

  return (
    <Container maxW={"1200px"}>
      {/* 頁面頂部的返回按鈕 */}
      <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Link href="/">
          <Button>Back</Button>
        </Link>
      </Flex>

      <Heading mt={"40px"}>Store</Heading>
      <Text>Purchase tools with $CARROTS to increase your earnings.</Text>
      
      {/* 如果 nfts 有資料，使用 Slider；否則給予空狀態提示 */}
      {!nfts || nfts.length === 0 ? (
        <Text mt={8}>No NFTs available in the store at the moment.</Text>
      ) : (
        <Slider {...sliderSettings}>
          {nfts.map((nftItem) => (
            <div key={nftItem.metadata.id}>
              <NFT nft={nftItem} />
            </div>
          ))}
        </Slider>
      )}
    </Container>
  );
}