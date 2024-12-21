import React from "react";
import { useEffect, useState } from "react";
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
import Slider, { Settings } from "react-slick";
import NFT from "./NFT";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Store() {
  const { contract, isLoading: isContractLoading } = useContract(TOOLS_ADDRESS);
  const { data: nfts, isLoading: isNFTsLoading } = useNFTs(contract);
  const [sliderReady, setSliderReady] = useState(false);

  useEffect(() => {
    if (!isContractLoading && !isNFTsLoading) {
      setSliderReady(true);
    }
  }, [isContractLoading, isNFTsLoading]);

  // Slider 配置
  const sliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "0px",
  };

  if (isContractLoading || isNFTsLoading) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (!nfts || nfts.length === 0) {
    return (
      <Container maxW="1200px" mt={5} centerContent>
        <Heading>No NFTs Available</Heading>
        <Text mt={2}>Please check back later for new tools!</Text>
      </Container>
    );
  }

  return (
    <Container maxW={"1200px"} mt={5} centerContent>
      <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"} width="100%" maxW="800px">
        <Link href="/">
          <Button>Back</Button>
        </Link>
      </Flex>

      <Heading mt={5} textAlign="center">Store</Heading>
      <Text textAlign="center" mt={2}>Purchase tools with $CARROTS to increase your earnings.</Text>

      <Box mt={10} width="100%" maxW="800px">
        {sliderReady ? (
          <Slider {...sliderSettings}>
            {nfts.map((nftItem) => (
              <Box key={nftItem.metadata.id} p={5} textAlign="center" style={{ margin: "0 auto", maxWidth: "400px" }}>
                <NFT nft={nftItem} />
              </Box>
            ))}
          </Slider>
        ) : (
          <Spinner size="lg" />
        )}
      </Box>
    </Container>
  );
}