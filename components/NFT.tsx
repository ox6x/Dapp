import { useState } from "react";
import { Text, Card, Button, Input, Flex } from "@chakra-ui/react";
import {
  MediaRenderer,
  Web3Button,
  useActiveClaimCondition,
  useContract,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data, isLoading } = useActiveClaimCondition(
    contract,
    nft.metadata.id // Token ID untuk kontrak ERC1155
  );
  const [quantity, setQuantity] = useState(1);

  // Helper untuk mengira jumlah harga
  const getNFTPrice = (quantity: number) =>
    data ? parseFloat(ethers.utils.formatEther(data?.price)) * quantity : 0;

  return (
    <Card key={nft.metadata.id} overflow={"hidden"} p={5}>
      <MediaRenderer src={nft.metadata.image} height="100%" width="100%" />
      <Text fontSize={"2xl"} fontWeight={"bold"} my={5} textAlign={"center"}>
        {nft.metadata.name}
      </Text>

      {!isLoading && data ? (
        <>
          <Text textAlign={"center"} my={3}>
            Cost per NFT: {ethers.utils.formatEther(data?.price)}{" "}
            {data?.currencyMetadata.symbol}
          </Text>

          {/* Pilihan kuantiti */}
          <Flex justify={"center"} align={"center"} my={3}>
            <Button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              size={"sm"}
            >
              -
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              textAlign={"center"}
              mx={2}
              width={16}
            />
            <Button
              onClick={() => setQuantity(quantity + 1)}
              size={"sm"}
            >
              +
            </Button>
          </Flex>

          <Text textAlign={"center"} my={3}>
            Total Cost: {getNFTPrice(quantity).toFixed(4)}{" "}
            {data?.currencyMetadata.symbol}
          </Text>
        </>
      ) : (
        <Text textAlign={"center"}>Loading...</Text>
      )}

      {/* Butang Web3 dengan kuantiti dinamik */}
      <Web3Button
        contractAddress={TOOLS_ADDRESS}
        action={(contract) =>
          contract.erc1155.claim(nft.metadata.id, quantity)
        }
        onSuccess={() => {
          setQuantity(1);
          alert("NFT claimed!");
        }}
        onError={(err) => alert(`Error: ${err.message}`)}
      >
        {`Buy ${quantity} NFT${quantity > 1 ? "s" : ""}`}
      </Web3Button>
    </Card>
  );
}