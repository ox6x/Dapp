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
  useContract,
  useNFTs,
} from "@thirdweb-dev/react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

// 匯入 Coinbase 風格的 SCSS
import styles from "./supplier.module.scss";

export default function StorePage() {
  // 連接合約
  const { contract } = useContract(TOOLS_ADDRESS);
  // 取得合約內所有 NFT
  const { data: nfts } = useNFTs(contract);

  // slick slider 設定
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

  // 載入中顯示
  const renderSpinner = () => (
    <Flex h="50vh" justifyContent="center" alignItems="center">
      <Spinner />
    </Flex>
  );

  // NFT 卡片子元件
  const NFTComponent = ({ nft }: { nft: NFTType }) => {
    const { data, isLoading } = useActiveClaimCondition(contract, nft.metadata.id);

    const [quantity, setQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // 計算總價格
    const totalPrice = !isLoading && data
      ? ethers.utils.formatEther(
          ethers.BigNumber.from(data.price).mul(quantity)
        )
      : "Loading...";

    // 處理交易
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

    // 數量調整
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    // 文字框變更
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
        {/* NFT 圖片 */}
        <MediaRenderer
          src={nft.metadata.image}
          height="100%"
          width="100%"
          className={styles.nftImage}
        />

        {/* NFT 標題 */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          my={5}
          textAlign="center"
          className={styles.nftTitle}
        >
          {nft.metadata.name}
        </Text>

        {!isLoading && data ? (
          <Text textAlign="center" my={5} className={styles.nftPrice}>
            Total Cost: {totalPrice} {data.currencyMetadata.symbol}
          </Text>
        ) : (
          <Text textAlign="center">Loading...</Text>
        )}

        {/* 數量控制 */}
        <Flex
          justifyContent="center"
          alignItems="center"
          gap="10px"
          mt={5}
          className={styles.quantityControl}
        >
          <Button
            onClick={decrementQuantity}
            disabled={isProcessing || quantity <= 1}
            width="fit-content"
          >
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
          <Button
            onClick={incrementQuantity}
            disabled={isProcessing}
            width="fit-content"
          >
            +
          </Button>
        </Flex>

        {/* 交易按鈕 */}
        <Flex justifyContent="center" mt={5}>
          <Button
            onClick={handleTransaction}
            isLoading={isProcessing}
            loadingText="Processing"
            colorScheme="blue"
            width="fit-content"
            className={styles.rentButton}
          >
            Rent
          </Button>
        </Flex>
      </Card>
    );
  };

  // NFT Slider
  const renderNFTSlider = () => (
    <div className={styles.sliderWrapper}>
      <Slider {...sliderSettings}>
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
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Link href="/">
          <Flex justifyContent="center">
            <Button width="fit-content">Back</Button>
          </Flex>
        </Link>
      </Flex>

      <Heading mt="40px" textAlign="center" className={styles.pageTitle}>
        Coinbase Supplier
      </Heading>
      <Text textAlign="center" className={styles.pageSubtitle}>
        Gain access to high-performance NFT tools and enhance your earnings on Coinbase!
      </Text>

      {/* NFT 資料載入 */}
      {!nfts ? renderSpinner() : renderNFTSlider()}
    </Container>
  );
}