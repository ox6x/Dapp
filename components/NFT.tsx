import { useState } from "react";
import { Text, Card } from "@chakra-ui/react";
import { MediaRenderer, useContract, useActiveClaimCondition } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const [quantity, setQuantity] = useState(1); // 初始化数量状态
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data, isLoading } = useActiveClaimCondition(
    contract,
    nft.metadata.id // 传入ERC1155需要的Token ID
  );

  // 获取单个NFT价格的函数
  const getNFTPrice = (quantity: number) => {
    if (!data) return "0";
    const pricePerNFT = ethers.utils.formatEther(data.price);
    return (parseFloat(pricePerNFT) * quantity).toFixed(4); // 返回总价并保留四位小数
  };

  // 处理NFT Claim逻辑
  const claimTo = async ({
    contract,
    to,
    quantity,
  }: {
    contract: any;
    to: string;
    quantity: bigint;
  }) => {
    if (!contract) return;
    try {
      await contract.erc1155.claim(nft.metadata.id, quantity);
    } catch (err) {
      console.error("Error claiming NFT:", err);
    }
  };

  return (
    <Card key={nft.metadata.id} overflow={"hidden"}>
      {/* 图片显示 */}
      <MediaRenderer src={nft.metadata.image} height="100%" width="100%" />
      {/* NFT名称 */}
      <Text fontSize={"2xl"} fontWeight={"bold"} my={5} textAlign={"center"}>
        {nft.metadata.name}
      </Text>
      {/* 价格显示 */}
      {!isLoading && data ? (
        <Text textAlign={"center"} my={5}>
          Cost per NFT: {ethers.utils.formatEther(data?.price)}{" "}
          {data?.currencyMetadata.symbol}
        </Text>
      ) : (
        <Text>Loading...</Text>
      )}
      {/* 数量选择器 */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", margin: "10px 0" }}>
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setQuantity(isNaN(value) ? 1 : Math.max(1, value));
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
          onClick={() => setQuantity(quantity + 1)}
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
      {/* Claim 按钮 */}
      <TransactionButton
        transaction={() =>
          claimTo({
            contract,
            to: "your-wallet-address", // 替换为实际钱包地址
            quantity: BigInt(quantity),
          })
        }
        onTransactionConfirmed={async () => {
          setQuantity(1); // 重置数量
          alert("NFT claimed!");
        }}
      >
        {`Claim NFT (${getNFTPrice(quantity)} ETH)`}
      </TransactionButton>
    </Card>
  );
}

// TransactionButton组件
type TransactionButtonProps = {
  transaction: () => Promise<void>;
  onTransactionConfirmed: () => void;
  children: React.ReactNode;
};

const TransactionButton = ({
  transaction,
  onTransactionConfirmed,
  children,
}: TransactionButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await transaction();
      onTransactionConfirmed();
    } catch (err) {
      console.error("Transaction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: "10px 20px",
        backgroundColor: "#3182ce",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {loading ? "Processing..." : children}
    </button>
  );
};