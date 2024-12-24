import React, { useState, useEffect } from "react";
import {
  Text,
  Card,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
import debounce from "lodash.debounce";
import styles from "./supplier.module.scss";

export default function StorePage() {
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
    window.location.reload();
  };

  const { contract } = useContract(TOOLS_ADDRESS);
  const { data: nfts } = useNFTs(contract);

  const renderSpinner = () => (
    <Flex h="50vh" justifyContent="center" alignItems="center">
      <Spinner color="#f3ba2f" size="xl" />
    </Flex>
  );

  const NFTComponent = ({ nft }: { nft: NFTType }) => {
    const { data: claimCondition, isLoading } = useActiveClaimCondition(
      contract,
      nft.metadata.id
    );
    const [quantity, setQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const maxQuantity = 1000; // 假设最大购买数量
    const totalPrice = claimCondition
      ? ethers.utils.formatEther(
          ethers.BigNumber.from(claimCondition.price).mul(quantity)
        )
      : "Loading...";

    const debouncedSetQuantity = debounce((value: number) => {
      setQuantity(value);
    }, 300);

    const handleQuantityChange = (valueAsString: string, valueAsNumber: number) => {
      if (valueAsNumber > maxQuantity) {
        alert(`The maximum quantity available is ${maxQuantity}`);
        debouncedSetQuantity(maxQuantity);
      } else if (valueAsNumber < 1) {
        alert("Quantity cannot be less than 1");
        debouncedSetQuantity(1);
      } else {
        debouncedSetQuantity(valueAsNumber);
      }
    };

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
      <Card
        overflow="hidden"
        p={5}
        className={styles.nftCard}
        border="1px solid #f3ba2f"
        borderRadius="12px"
        boxShadow="0 6px 12px rgba(0, 0, 0, 0.1)"
      >
        <MediaRenderer
          src={nft.metadata.image}
          height="100%"
          width="100%"
          className={styles.nftImage}
        />
        <Text fontSize="2xl" fontWeight="bold" my={5} textAlign="center" color="#2b6cb0">
          {nft.metadata.name}
        </Text>
        <Text textAlign="center" my={5} color="#333333">
          {claimCondition
            ? `Price: ${totalPrice} ${claimCondition.currencyMetadata.symbol}`
            : "Loading..."}
        </Text>
        <Flex justifyContent="center" alignItems="center" gap="10px" mt={5}>
          <NumberInput
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={maxQuantity}
            clampValueOnBlur // 自动修正非法值
            isDisabled={isProcessing}
            width="120px"
          >
            <NumberInputField placeholder="Enter quantity" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
        <Text textAlign="center" color="green.500" mt={2}>
          Total: {claimCondition ? `${totalPrice} ${claimCondition.currencyMetadata.symbol}` : "Loading..."}
        </Text>
        <Flex justifyContent="center" mt={5}>
          <Button
            onClick={handleTransaction}
            isLoading={isProcessing}
            loadingText="Processing"
            bg="#f3ba2f"
            _hover={{ bg: "#d4a214" }}
            color="white"
          >
            Acquire
          </Button>
        </Flex>
      </Card>
    );
  };

  const renderNFTSlider = () => (
    <div className={styles.sliderWrapper}>
      <Slider
        {...{
          dots: false,
          arrows: false,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: false,
          centerMode: true,
          centerPadding: "0",
        }}
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
      <Flex justifyContent="flex-start" alignItems="center" mt={5}>
        <Select
          value={version}
          onChange={handleVersionChange}
          width="auto"
          border="2px solid #f3ba2f"
          borderRadius="8px"
          color="#2b6cb0"
        >
          <option value="V1">ETH</option>
          <option value="V2">bETH</option>
        </Select>
      </Flex>

      {/* 主標題與描述 */}
      <Heading mt="40px" textAlign="center" color="#f3ba2f" className={styles.pageTitle}>
        Web3 NFT Marketplace
      </Heading>
      <Text textAlign="center" color="#2b6cb0" className={styles.pageSubtitle}>
        Discover, acquire, and manage your digital assets effortlessly.
      </Text>

      {/* NFT 列表或加載中 Spinner */}
      {!nfts ? renderSpinner() : renderNFTSlider()}
    </Container>
  );
}