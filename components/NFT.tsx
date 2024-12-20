import { useState } from "react";
import {
  Text,
  Card,
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Spinner,
} from "@chakra-ui/react";
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
    <Card key={nft.metadata.id} overflow={"hidden"} p={5} shadow="md" borderWidth="1px">
      <Stack spacing={4} align="center">
        {/* 图片显示 */}
        <Box>
          <MediaRenderer src={nft.metadata.image} height="200px" width="200px" />
        </Box>
        {/* NFT名称 */}
        <Text fontSize={"xl"} fontWeight={"bold"} textAlign={"center"}>
          {nft.metadata.name}
        </Text>
        {/* 价格显示 */}
        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          <Text fontSize="md" color="gray.600" textAlign={"center"}>
            Cost per NFT: {ethers.utils.formatEther(data?.price)}{" "}
            {data?.currencyMetadata.symbol}
          </Text>
        )}
        {/* 数量选择器 */}
        <Flex align="center" gap={3}>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            isDisabled={quantity <= 1}
          >
            -
          </Button>
          <Input
            size="sm"
            type="number"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setQuantity(isNaN(value) ? 1 : Math.max(1, value));
            }}
            textAlign="center"
            width="60px"
          />
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </Flex>
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
      </Stack>
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
    <Button
      onClick={handleClick}
      isLoading={loading}
      colorScheme="blue"
      loadingText="Processing"
      width="full"
    >
      {children}
    </Button>
  );
};