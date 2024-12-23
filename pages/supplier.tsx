import React, { useState } from "react";
import { 
  Text, 
  Card, 
  Button, 
  Input, 
  Container, 
  Flex, 
  Heading, 
  Spinner 
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
import Slider, { Settings } from "react-slick"; // <-- 注意：從 react-slick 匯入 Settings 型別
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

export default function StorePage() {
  // 連接到合約
  const { contract } = useContract(TOOLS_ADDRESS);
  // 取得 NFT 清單
  const { data: nfts } = useNFTs(contract);

  // 宣告 Slider 設定，使用 Settings 型別
  const sliderSettings: Settings = {
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
    <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
      <Spinner />
    </Flex>
  );

  // NFT 卡片子組件
  const NFTComponent = ({ nft }: { nft: NFTType }) => {
    // 讀取可領取條件
    const { data, isLoading } = useActiveClaimCondition(
      contract,
      nft.metadata.id // Token ID for ERC1155
    );

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
        alert(`Successfully purchased ${quantity} ${nft.metadata.name}!`);
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

    // 文字框輸入事件
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setQuantity(isNaN(value) || value < 1 ? 1 : value);
    };

    return (
      <Card key={nft.metadata.id} overflow={"hidden"} p={5}>
        <MediaRenderer src={nft.metadata.image} height="100%" width="100%" />
        <Text
          fontSize={"2xl"}
          fontWeight={"bold"}
          my={5}
          textAlign={"center"}
        >
          {nft.metadata.name}
        </Text>

        {!isLoading && data ? (
          <Text textAlign={"center"} my={5}>
            Total Cost: {totalPrice} {data.currencyMetadata.symbol}
          </Text>
        ) : (
          <Text textAlign={"center"}>Loading...</Text>
        )}

        {/* 數量控制區域 */}
        <Flex justifyContent="center" alignItems="center" gap="10px" mt={5}>
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
          >
            Rent
          </Button>
        </Flex>
      </Card>
    );
  };

  // NFT Slider
  const renderNFTSlider = () => (
    <Slider {...sliderSettings}>
      {nfts?.map((nftItem) => (
        <div key={nftItem.metadata.id}>
          <NFTComponent nft={nftItem} />
        </div>
      ))}
    </Slider>
  );

  return (
    <Container maxW={"1200px"}>
      {/* Header */}
      <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Link href="/">
          <Flex justifyContent="center">
            <Button width="fit-content">Back</Button>
          </Flex>
        </Link>
      </Flex>
      {/* 標題 */}
      <Heading mt={"40px"} textAlign="center">
        Supplier
      </Heading>
      <Text textAlign="center" mt={2} mb={5}>
        Boost your earnings with exclusive tools that unlock unique advantages and free up your hands!
      </Text>

      {/* NFT 資料載入 */}
      {!nfts ? renderSpinner() : renderNFTSlider()}
    </Container>
  );
}