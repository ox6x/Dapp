import { Text, Card, Button, Input, Container, Flex, Heading, Spinner } from "@chakra-ui/react";
import { MediaRenderer, useActiveClaimCondition, useContract, useNFTs } from "@thirdweb-dev/react";
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
            <Spinner />
        </Flex>
    );

    const NFTComponent = ({ nft }: { nft: NFTType }) => {
        const { data, isLoading } = useActiveClaimCondition(
            contract,
            nft.metadata.id // Token ID required for ERC1155 contracts
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
                alert(`Successfully purchased ${quantity} ${nft.metadata.name}!`);
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
            <Card key={nft.metadata.id} overflow={"hidden"}>
                <MediaRenderer
                    src={nft.metadata.image}
                    height="100%"
                    width="100%"
                />
                <Text fontSize={"2xl"} fontWeight={"bold"} my={5} textAlign={"center"}>
                    {nft.metadata.name}
                </Text>

                {!isLoading && data ? (
                    <Text textAlign={"center"} my={5}>
                        Total Cost: {totalPrice} {data.currencyMetadata.symbol}
                    </Text>
                ) : (
                    <Text>Loading...</Text>
                )}

                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                    <Button onClick={decrementQuantity} disabled={isProcessing || quantity <= 1}>-</Button>
                    <Input
                        type="number"
                        value={quantity}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        width="60px"
                        textAlign="center"
                    />
                    <Button onClick={incrementQuantity} disabled={isProcessing}>+</Button>
                </div>

                <Button
                    onClick={handleTransaction}
                    isLoading={isProcessing}
                    loadingText="Processing"
                    mt={4}
                    colorScheme="blue"
                    width="auto"
                >
                    Rent
                </Button>
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
        <Container maxW={"1200px"}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Link href="/">
                    <Button width="auto">Back</Button>
                </Link>
            </Flex>
            <Heading mt={"40px"}>Supplier</Heading>
            <Text>
                Boost your earnings with exclusive tools that unlock unique advantages and free up your hands!
            </Text>
            {!nfts ? renderSpinner() : renderNFTSlider()}
        </Container>
    );
}