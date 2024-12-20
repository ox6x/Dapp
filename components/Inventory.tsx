import {
  MediaRenderer,
  Web3Button,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import {
  Text,
  Box,
  Button,
  Flex,
  Input,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import Slider from "react-slick";

type Props = {
  nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
  const address = useAddress();
  const { contract: toolContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, newQuantity),
    }));
  };

  async function stakeNFT(id: string, quantity: number) {
    if (!address) return;

    const isApproved = await toolContract?.erc1155.isApproved(
      address,
      STAKING_ADDRESS
    );

    if (!isApproved) {
      await toolContract?.erc1155.setApprovalForAll(STAKING_ADDRESS, true);
    }

    await stakingContract?.call("stake", [id, quantity]);
  }

  if (!nft || nft.length === 0) {
    return (
      <Box textAlign="center" mt={5}>
        <Text>No tools.</Text>
        <Link href="/shop">
          <Button colorScheme="blue" mt={3}>
            Shop Tools
          </Button>
        </Link>
      </Box>
    );
  }

  // react-slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // 每次显示一列一个 NFT
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: true, // 显示左右箭头
  };

  return (
    <Box
      bg="gray.100"
      borderRadius="md"
      p={6}
      maxW="600px"
      mx="auto"
      boxShadow="lg"
    >
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        My Inventory
      </Heading>

      <Slider {...settings}>
        {nft.map((nftItem) => (
          <Box
            key={nftItem.metadata.id}
            p={4}
            width="100%" // 确保每个滑块占满容器宽度
          >
            <VStack spacing={4} align="center">
              {/* NFT 图片 */}
              <MediaRenderer
                src={nftItem.metadata.image}
                height="150px"
                width="150px"
              />
              <Text fontWeight="bold">{nftItem.metadata.name}</Text>

              {/* 数量选择器 */}
              <Flex align="center" justify="center" gap={2}>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() =>
                    handleQuantityChange(
                      nftItem.metadata.id,
                      (quantities[nftItem.metadata.id] || 1) - 1
                    )
                  }
                  isDisabled={(quantities[nftItem.metadata.id] || 1) <= 1}
                >
                  -
                </Button>
                <Input
                  size="sm"
                  type="number"
                  value={quantities[nftItem.metadata.id] || 1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handleQuantityChange(
                      nftItem.metadata.id,
                      isNaN(value) ? 1 : value
                    );
                  }}
                  textAlign="center"
                  w="60px"
                />
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() =>
                    handleQuantityChange(
                      nftItem.metadata.id,
                      (quantities[nftItem.metadata.id] || 1) + 1
                    )
                  }
                >
                  +
                </Button>
              </Flex>

              {/* 质押按钮 */}
              <Web3Button
                contractAddress={STAKING_ADDRESS}
                action={() =>
                  stakeNFT(nftItem.metadata.id, quantities[nftItem.metadata.id] || 1)
                }
                style={{ marginTop: "10px" }}
              >
                {`Equip (${quantities[nftItem.metadata.id] || 1})`}
              </Web3Button>
            </VStack>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}