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
  Card,
  SimpleGrid,
  Stack,
  Flex,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

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
      [id]: Math.max(1, newQuantity), // 保證最小數量為 1
    }));
  };

  async function stakeNFT(id: string, quantity: number) {
    if (!address) {
      return;
    }

    const isApproved = await toolContract?.erc1155.isApproved(
      address,
      STAKING_ADDRESS
    );

    if (!isApproved) {
      await toolContract?.erc1155.setApprovalForAll(STAKING_ADDRESS, true);
    }

    await stakingContract?.call("stake", [id, quantity]);
  }

  if (nft?.length === 0) {
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

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {nft?.map((nft) => (
        <Card key={nft.metadata.id} p={5} shadow="md" borderWidth="1px">
          <Stack alignItems="center">
            {/* NFT 圖片 */}
            <MediaRenderer
              src={nft.metadata.image}
              height="100px"
              width="100px"
            />
            <Text fontWeight="bold">{nft.metadata.name}</Text>

            {/* 數量選擇器 */}
            <Flex
              align="center"
              justify="center"
              gap={2}
              mt={3}
              w="100%"
              maxW="200px"
            >
              <Button
                size="sm"
                colorScheme="red"
                onClick={() =>
                  handleQuantityChange(
                    nft.metadata.id,
                    (quantities[nft.metadata.id] || 1) - 1
                  )
                }
                isDisabled={(quantities[nft.metadata.id] || 1) <= 1} // 禁用負數數量
              >
                -
              </Button>
              <Input
                size="sm"
                type="number"
                value={quantities[nft.metadata.id] || 1}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  handleQuantityChange(
                    nft.metadata.id,
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
                    nft.metadata.id,
                    (quantities[nft.metadata.id] || 1) + 1
                  )
                }
              >
                +
              </Button>
            </Flex>

            {/* 質押按鈕 */}
            <Web3Button
              contractAddress={STAKING_ADDRESS}
              action={() =>
                stakeNFT(nft.metadata.id, quantities[nft.metadata.id] || 1)
              }
              style={{ marginTop: "10px" }}
            >
              {`Equip (${quantities[nft.metadata.id] || 1})`}
            </Web3Button>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}