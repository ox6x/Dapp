/* 
  supplier.tsx 
  - 主體程式碼: 使用 Chakra UI, slick, thirdweb-dev
  - 文字改為英文, 提供繁體中文註解 
*/

import {
  Text,
  Card,
  Button,
  Input,
  Container,
  Flex,
  Heading,
  Spinner,
  Box,
  Divider,
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
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import styles from "./supplier.module.scss"; // <-- 匯入 SCSS

export default function SupplierPage() {
  // 連接指定的合約
  const { contract } = useContract(TOOLS_ADDRESS);
  // 取得 NFT 清單
  const { data: nfts } = useNFTs(contract);

  // Slick Slider 設定
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

  // 載入中顯示用
  const renderSpinner = () => (
    <Flex h="50vh" justifyContent="center" alignItems="center">
      <Spinner size="xl" />
    </Flex>
  );

  // NFT 卡片組件
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

    // 執行交易
    const handleTransaction = async () => {
      if (!contract || isProcessing) return;

      setIsProcessing(true);
      try {
        await contract.erc1155.claim(nft.metadata.id, quantity);
        alert(`Successfully rented ${quantity} x "${nft.metadata.name}"!`);
      } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed. Please try again later.");
      } finally {
        setIsProcessing(false);
      }
    };

    // 數量調整
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    // 輸入框變更
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setQuantity(isNaN(value) || value < 1 ? 1 : value);
    };

    return (
      <Card
        key={nft.metadata.id}
        overflow="hidden"
        p={5}
        shadow="lg"
        borderRadius="md"
        className={styles["supplier-page__card"]} // BEM
      >
        {/* NFT 圖片 */}
        <MediaRenderer
          src={nft.metadata.image}
          height="300px"
          width="100%"
          style={{ borderRadius: "8px" }}
          className={styles["supplier-page__card-img"]}
        />

        {/* NFT 名稱 */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          my={5}
          textAlign="center"
          className={styles["supplier-page__card-title"]}
        >
          {nft.metadata.name}
        </Text>

        {/* 顯示價格 */}
        {!isLoading && data ? (
          <Text
            textAlign="center"
            my={5}
            className={styles["supplier-page__card-price"]}
          >
            Total Price: {totalPrice} {data.currencyMetadata.symbol}
          </Text>
        ) : (
          <Text textAlign="center">Loading...</Text>
        )}

        {/* 數量控制區域 */}
        <Flex
          justifyContent="center"
          alignItems="center"
          gap="10px"
          mt={5}
          className={styles["supplier-page__card-controls"]}
        >
          <Button
            onClick={decrementQuantity}
            disabled={isProcessing || quantity <= 1}
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            disabled={isProcessing}
          />
          <Button onClick={incrementQuantity} disabled={isProcessing}>
            +
          </Button>
        </Flex>

        {/* 交易按鈕 */}
        <Flex justifyContent="center" mt={5}>
          <Button
            onClick={handleTransaction}
            isLoading={isProcessing}
            loadingText="Processing..."
            width="fit-content"
            className={styles["supplier-page__card-rentBtn"]}
          >
            Rent This Tool
          </Button>
        </Flex>
      </Card>
    );
  };

  // NFT Slider
  const renderNFTSlider = () => (
    <Slider {...sliderSettings} className={styles["supplier-page__slider"]}>
      {nfts?.map((nftItem) => (
        <div key={nftItem.metadata.id}>
          <NFTComponent nft={nftItem} />
        </div>
      ))}
    </Slider>
  );

  return (
    <Container maxW="1200px" py={5} className={styles["supplier-page"]}>
      {/* 頂部 Header 區塊 */}
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        py={4}
        className={styles["supplier-page__header"]}
      >
        {/* 返回按鈕 */}
        <Link href="/">
          <Button
            width="fit-content"
            size="sm"
            className={styles["supplier-page__header-btn"]}
          >
            Back
          </Button>
        </Link>

        {/* 標題 */}
        <Heading size="lg" className={styles["supplier-page__header-title"]}>
          Resource Center
        </Heading>
      </Flex>

      <Divider my={4} />

      {/* 簡介區塊 */}
      <Box textAlign="center" my={6} className={styles["supplier-page__intro"]}>
        <Heading size="md" className={styles["supplier-page__intro-title"]}>
          Explore Powerful NFT Tools
        </Heading>
        <Text mt={2} fontSize="lg" className={styles["supplier-page__intro-desc"]}>
          Utilize high-performance tools to enhance your rewards and unlock exclusive platform features.
        </Text>
      </Box>

      {/* NFT Slider 區塊 */}
      {!nfts ? renderSpinner() : renderNFTSlider()}

      <Divider my={8} />

      {/* 底部 Footer 區塊 */}
      <Box textAlign="center" mt={5} className={styles["supplier-page__footer"]}>
        <Text fontSize="sm">
          Having trouble? Check our{" "}
          <Link href="/faq">
            <span className="faq-link">FAQ</span>
          </Link>
          .
        </Text>
      </Box>
    </Container>
  );
}