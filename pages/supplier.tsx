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

export default function StorePage() {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data: nfts } = useNFTs(contract);

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
            <Spinner size="xl" />
        </Flex>
    );

    const NFTComponent = ({ nft }: { nft: NFTType }) => {
        const { data, isLoading } = useActiveClaimCondition(
            contract,
            nft.metadata.id
        );

        const [quantity, setQuantity] = useState(1);
        const [isProcessing, setIsProcessing] = useState(false);

        const totalPrice = !isLoading && data
            ? ethers.utils.formatEther(ethers.BigNumber.from(data.price).mul(quantity))
            : "Loading...";

        const handleTransaction = async () => {
            if (!contract || isProcessing) return;

            setIsProcessing(true);
            try {
                await contract.erc1155.claim(nft.metadata.id, quantity);
                alert(`Successfully rented ${quantity} ${nft.metadata.name}!`);
            } catch (error) {
                console.error("Transaction failed:", error);
                alert("Transaction failed, please try again.");
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
            <Card key={nft.metadata.id} overflow={"hidden"} p={5} shadow="lg" borderRadius="md">
                <MediaRenderer
                    src={nft.metadata.image}
                    height="300px"
                    width="100%"
                    style={{ borderRadius: "8px" }}
                />
                <Text fontSize={"2xl"} fontWeight={"bold"} my={5} textAlign={"center"}>
                    {nft.metadata.name}
                </Text>

                {!isLoading && data ? (
                    <Text textAlign={"center"} my={5}>
                        Total Cost: {totalPrice} {data.currencyMetadata.symbol}
                    </Text>
                ) : (
                    <Text textAlign={"center"}>Loading...</Text>
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
                    <Button onClick={incrementQuantity} disabled={isProcessing} width="fit-content">
                        +
                    </Button>
                </Flex>

                <Flex justifyContent="center" mt={5}>
                    <Button
                        onClick={handleTransaction}
                        isLoading={isProcessing}
                        loadingText="Processing"
                        colorScheme="blue"
                        width="fit-content"
                    >
                        Rent Tool
                    </Button>
                </Flex>
            </Card>
        );
    };

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
            {/* Header Section */}
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"} py={4}>
                <Link href="/">
                    <Button width="fit-content" colorScheme="blue" size="sm">Back</Button>
                </Link>
                <Heading size="lg">Resource Hub</Heading>
            </Flex>

            <Divider my={4} />

            {/* Intro Section */}
            <Box textAlign="center" my={6}>
                <Heading size="md">Discover Powerful NFT Tools</Heading>
                <Text mt={2} fontSize="lg">
                    Boost your earnings and unlock exclusive features with high-performance tools and assets.
                </Text>
            </Box>

            {/* NFT Slider Section */}
            {!nfts ? renderSpinner() : renderNFTSlider()}

            <Divider my={8} />

            {/* Footer Section */}
            <Box textAlign="center" mt={5}>
                <Text fontSize="sm" color="gray.500">
                    Need help? Check out our <Link href="/faq"><Text as="span" color="blue.500">FAQ</Text></Link>.
                </Text>
            </Box>
        </Container>
    );
}