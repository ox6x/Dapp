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
import NFT from "../components/NFT";

export default function Store() {
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data: nfts } = useNFTs(contract);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // For tablets and smaller devices
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For mobile devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container maxW={"1200px"}>
      {/* Header Section */}
      <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Link href="/">
          <Button>Back</Button>
        </Link>
      </Flex>

      {/* Store Heading */}
      <Heading mt={"40px"}>Store</Heading>
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