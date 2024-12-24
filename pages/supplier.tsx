import React, { useState } from "react";
import {
  Text,
  Card,
  Button,
  Input,
  Container,
  Flex,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import {
  MediaRenderer,
  useActiveClaimCondition,
  useNFTs,
} from "@thirdweb-dev/react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import styles from "./supplier.module.scss";
import { useContractState } from "../contexts/ContractContext";

export default function StorePage() {
  const { state, dispatch } = useContractState();
  const { contract } = state;
  const { data: nfts } = useNFTs(contract || undefined);

  const handleVersionChange = (newVersion: "V1" | "V2") => {
    dispatch({ type: "SET_VERSION", version: newVersion });
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    centerMode: true,
    centerPadding: "0",
  };

  const renderSpinner = () => (
    <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
      <Spinner />
    </Flex>
  );

  const NFTComponent = ({ nft }: { nft: NFTType }) => {
    const { data, isLoading } = useActiveClaimCondition(contract, nft.metadata.id);

    const [quantity, setQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = !isLoading && data
      ? ethers.utils.formatEther(
          ethers.BigNumber.from(data.price).mul(quantity)
        )
      : "Loading...";

    const handleTransaction = async () => {
      if (!contract || isProcessing) return;

      setIsProcessing(true);
      try {
        await contract.erc1155.claim(nft.metadata.id, quantity);
        alert(`Successfully purchased ${quantity} x ${nft.metadata.name}!`);
      } catch (error) {
        console.error("Transaction failed:", error);
        alert(`Transaction failed: ${error.message || "Please try again."}`);
      } finally {
        setIsProcessing(false);
      }
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setQuantity(isNaN(value) || value < 1 ? 1 : value);
    };

    return (
      <Card
        key={nft.metadata.id}
        overflow="hidden"
        p={5}
        className={styles.nftCard}
      >
        <MediaRenderer src={nft.metadata.image} height="100%" width="100%" />
        <Text fontSize="2xl" fontWeight="bold" my={5} textAlign="center">
          {nft.metadata.name}
        </Text>
        {!isLoading && data ? (
          <Text textAlign="center" my={5}>
            Total Cost: {totalPrice} {data.currencyMetadata.symbol}
          </Text>
        ) : (
          <Text textAlign="center">Loading...</Text>
        )}
        <Flex justifyContent="center" alignItems="center" gap="10px" mt={5}>
          <Button onClick={decrementQuantity} disabled={isProcessing || quantity <= 1}>
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            disabled={isProcessing}
            width="60px"
            textAlign="center"
          />
          <Button onClick={incrementQuantity} disabled={isProcessing}>
            +
          </Button>
        </Flex>
        <Flex justifyContent="center" mt={5}>
          <Button
            onClick={handleTransaction}
            isLoading={isProcessing}
            loadingText="Processing"
            colorScheme="blue"
          >
            Acquire
          </Button>
        </Flex>
      </Card>
    );
  };

  const renderNFTSlider = () => {
    if (!nfts || nfts.length === 0) {
      return <Text textAlign="center">No NFTs available</Text>;
    }

    return (
      <div className={styles.sliderWrapper}>
        <Slider {...sliderSettings}>
          {nfts.map((nftItem) => (
            <div key={nftItem.metadata.id}>
              <NFTComponent nft={nftItem} />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <Container maxW="1200px" className={styles.storePage}>
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Link href="/">
          <Button width="fit-content">Back</Button>
        </Link>
        <Flex>
          <Button onClick={() => handleVersionChange("V1")} width="fit-content" m={2}>
            V1
          </Button>
          <Button onClick={() => handleVersionChange("V2")} width="fit-content" m={2}>
            V2
          </Button>
        </Flex>
      </Flex>
      <Heading mt="40px" textAlign="center">
        Coinbase NFT Hub
      </Heading>
      <Text textAlign="center">Experience seamless NFT accessibility.</Text>
      {!nfts ? renderSpinner() : renderNFTSlider()}
    </Container>
  );
}