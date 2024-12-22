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
  Spinner,
  Stack
} from "@chakra-ui/react";
import NFT from "../components/NFT";
import NFTQuantityTransaction from "../components/NFTQuantityTransaction"; // 引入數量選擇組件
import { useState } from "react";

export default function Store() {
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data: nfts, isLoading } = useNFTs(contract);
  const pricePerItem = 10; // 單個 NFT 的靜態價格，可根據需求改為動態值

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // 一次只顯示一個
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true, // 啟用置中
    centerPadding: "0", // 確保內容完全置中
  };

  // 如果載入中，顯示 Spinner
  if (isLoading) {
    return (
      <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
        <Spinner />
      </Flex>
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
            <Stack key={nftItem.metadata.id} p={5}>
              {/* NFT 詳情卡片 */}
              <NFT nft={nftItem} />
              
              {/* 使用 NFTQuantityTransaction 實現購買數量選擇和動態總價 */}
              <NFTQuantityTransaction
                initialQuantity={1}
                minQuantity={1}
                getPrice={(quantity) => `${quantity * pricePerItem} CARROTS`}
                onTransaction={(quantity) => {
                  alert(`Purchasing ${quantity} items for ${quantity * pricePerItem} CARROTS`);
                }}
                onTransactionConfirmed={() => alert("Purchase confirmed!")}
                buttonText="BUY"
              />
            </Stack>
          ))}
        </Slider>
      )}
    </Container>
  );
}