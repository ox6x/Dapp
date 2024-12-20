import { MediaRenderer, Web3Button, useAddress, useContract } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import { Text, Box, Button, Card, SimpleGrid, Stack } from "@chakra-ui/react";
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
      [id]: Math.max(1, newQuantity), // 保证最小数量为1
    }));
  };

  async function stakeNFT(id: string, quantity: number) {
    if (!address) {
      return;
    }

    const isApproved = await toolContract?.erc1155.isApproved(address, STAKING_ADDRESS);

    if (!isApproved) {
      await toolContract?.erc1155.setApprovalForAll(STAKING_ADDRESS, true);
    }

    await stakingContract?.call("stake", [id, quantity]);
  }

  if (nft?.length === 0) {
    return (
      <Box>
        <Text>No tools.</Text>
        <Link href="/shop">
          <Button>Shop Tool</Button>
        </Link>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={3} spacing={4}>
      {nft?.map((nft) => (
        <Card key={nft.metadata.id} p={5}>
          <Stack alignItems={"center"}>
            <MediaRenderer src={nft.metadata.image} height="100px" width="100px" />
            <Text>{nft.metadata.name}</Text>

            {/* 数量选择器 */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", margin: "10px 0" }}>
              <button
                onClick={() => handleQuantityChange(nft.metadata.id, (quantities[nft.metadata.id] || 1) - 1)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#f56565",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                -
              </button>
              <input
                type="number"
                value={quantities[nft.metadata.id] || 1}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  handleQuantityChange(nft.metadata.id, isNaN(value) ? 1 : value);
                }}
                style={{
                  width: "60px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "5px",
                }}
              />
              <button
                onClick={() => handleQuantityChange(nft.metadata.id, (quantities[nft.metadata.id] || 1) + 1)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#48bb78",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>

            {/* 质押按钮 */}
            <Web3Button
              contractAddress={STAKING_ADDRESS}
              action={() => stakeNFT(nft.metadata.id, quantities[nft.metadata.id] || 1)}
            >
              {`Equip (${quantities[nft.metadata.id] || 1})`}
            </Web3Button>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}