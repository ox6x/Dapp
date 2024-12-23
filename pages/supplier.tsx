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

export default function SupplierPage() {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data: nfts } = useNFTs(contract);

    // Slider 設定
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
        <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
            <Spinner size="xl" />
        </Flex>
    );

    // 單一 NFT 物件卡片
    const NFTComponent = ({ nft }: { nft: NFTType }) => {
        const { data, isLoading } = useActiveClaimCondition(
            contract,
            nft.metadata.id
        );

        const [quantity, setQuantity] = useState(1);
        const [isProcessing, setIsProcessing] = useState(false);

        // 計算總價格
        const totalPrice =
            !isLoading && data
                ? ethers.utils.formatEther(
                      ethers.BigNumber.from(data.price).mul(quantity)
                  )
                : "載入中...";

        // 按鈕交易執行
        const handleTransaction = async () => {
            if (!contract || isProcessing) return;

            setIsProcessing(true);
            try {
                await contract.erc1155.claim(nft.metadata.id, quantity);
                alert(`成功租用 ${quantity} 個「${nft.metadata.name}」！`);
            } catch (error) {
                console.error("交易失敗：", error);
                alert("交易失敗，請稍後再試。");
            } finally {
                setIsProcessing(false);
            }
        };

        // 數量加減
        const incrementQuantity = () => setQuantity((prev) => prev + 1);
        const decrementQuantity = () =>
            setQuantity((prev) => Math.max(1, prev - 1));

        // 文字框輸入變更
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.target.value, 10);
            setQuantity(isNaN(value) || value < 1 ? 1 : value);
        };

        return (
            <Card key={nft.metadata.id} overflow={"hidden"} p={5} shadow="lg" borderRadius="md">
                <MediaRenderer
                    src={nft.metadata.image}
                    height="300px"
                    width="100%"
                    style={{ borderRadius: "8px" }}
                />
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
                        總價格：{totalPrice} {data.currencyMetadata.symbol}
                    </Text>
                ) : (
                    <Text textAlign={"center"}>載入中...</Text>
                )}

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

                <Flex justifyContent="center" mt={5}>
                    <Button
                        onClick={handleTransaction}
                        isLoading={isProcessing}
                        loadingText="交易處理中"
                        colorScheme="blue"
                        width="fit-content"
                    >
                        租用此工具
                    </Button>
                </Flex>
            </Card>
        );
    };

    // 產生 NFT Slider
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
        <Container maxW={"1200px"} py={5}>
            {/* 頂部 Header 區塊 */}
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"} py={4}>
                <Link href="/">
                    <Button width="fit-content" colorScheme="blue" size="sm">
                        返回
                    </Button>
                </Link>
                <Heading size="lg">資源中心</Heading>
            </Flex>

            <Divider my={4} />

            {/* 簡介說明區塊 */}
            <Box textAlign="center" my={6}>
                <Heading size="md">探索強大的 NFT 工具</Heading>
                <Text mt={2} fontSize="lg">
                    利用高性能工具與資產，提升您的收益並解鎖更多平台專屬功能。
                </Text>
            </Box>

            {/* NFT Slider 區塊 */}
            {!nfts ? renderSpinner() : renderNFTSlider()}

            <Divider my={8} />

            {/* 底部 Footer 區塊 */}
            <Box textAlign="center" mt={5}>
                <Text fontSize="sm" color="gray.500">
                    遇到問題嗎？前往{" "}
                    <Link href="/faq">
                        <Text as="span" color="blue.500">常見問題(FAQ)</Text>
                    </Link>{" "}
                    尋求協助。
                </Text>
            </Box>
        </Container>
    );
}