import React, { useState, useEffect } from "react";
import {
  Text,
  Card,
  Button,
  Input,
  Container,
  Flex,
  Heading,
  Spinner,
  Select,
} from "@chakra-ui/react";
import {
  MediaRenderer,
  useActiveClaimCondition,
  useContract,
  useNFTs,
} from "@thirdweb-dev/react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS, setVersion } from "../const/addresses";
import { ethers } from "ethers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./supplier.module.scss";

export default function StorePage() {
  // 處理版本切換
  const [version, setVersionState] = useState<"V1" | "V2">("V1");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVersion = localStorage.getItem("ADDRESS_VERSION") as "V1" | "V2";
      if (savedVersion) {
        setVersionState(savedVersion);
        setVersion(savedVersion);
      }
    }
  }, []);

  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVersion = event.target.value as "V1" | "V2";
    setVersionState(newVersion);
    setVersion(newVersion);
    window.location.reload(); // 重新加載頁面應用合約更改
  };

  // 連接合約並加載 NFT
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data: nfts } = useNFTs(contract);

  // 處理數量調整邏輯
  const useQuantity = (initialQuantity = 1) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setQuantity(isNaN(value) || value < 1 ? 1 : value);
    };

    return { quantity, increment, decrement, handleInputChange };
  };

  // 加載中的顯示
  const renderSpinner = () => (
    <Flex h="50vh" justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  );

  // 單個 NFT 卡片渲染
  const NFTComponent = ({ nft }: { nft: NFTType }) => {
    const { data: claimCondition, isLoading } = useActiveClaimCondition(
      contract,
      nft.metadata.id
    );
    const { quantity, increment, decrement, handleInputChange } = useQuantity();
    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = claimCondition
      ? ethers.utils.formatEther(
          ethers.BigNumber.from(claimCondition.price).mul(quantity)
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
        alert("Transaction failed, please try again.");
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <Card overflow="hidden" p={5} className={styles.nftCard}>
        <MediaRenderer
          src={nft.metadata.image}
          height="100%"
          width="100%"
          className={styles.nftImage}
        />
        <Text fontSize="2xl" fontWeight="bold" my={5} textAlign="center">
          {nft.metadata.name}
        </Text>
        <Text textAlign="center" my={5}>
          {claimCondition
            ? `Total Cost: ${totalPrice} ${claimCondition.currencyMetadata.symbol}`
            : "Loading..."}
        </Text>
        <Flex justifyContent="center" alignItems="center" gap="10px" mt={5}>
          <Button onClick={decrement} disabled={isProcessing || quantity <= 1}>
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
          <Button onClick={increment} disabled={isProcessing}>
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

  // NFT Slider 渲染
  const renderNFTSlider = () => (
    <div className={styles.sliderWrapper}>
      <Slider
        dots={true}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={false}
        centerMode={true}
        centerPadding="0"
      >
        {nfts?.map((nftItem) => (
          <div key={nftItem.metadata.id}>
            <NFTComponent nft={nftItem} />
          </div>
        ))}
      </Slider>
    </div>
  );

  return (
    <Container maxW="1200px" className={styles.storePage}>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center">
        <Select
          value={version}
          onChange={handleVersionChange}
          width="fit-content"
        >
          <option value="V1">ETH</option>
          <option value="V2">bETH</option>
        </Select>
      </Flex>

      {/* 主標題與描述 */}
      <Heading mt="40px" textAlign="center" className={styles.pageTitle}>
        Coinbase NFT Hub
      </Heading>
      <Text textAlign="center" className={styles.pageSubtitle}>
        Experience a new era of digital assets with seamless NFT accessibility
        and advanced DeFi utility.
      </Text>

      {/* NFT 列表或加載中 Spinner */}
      {!nfts ? renderSpinner() : renderNFTSlider()}
    </Container>
  );
}