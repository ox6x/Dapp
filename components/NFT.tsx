import { Text, Card, Button, Input } from "@chakra-ui/react";
import { MediaRenderer, useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useState } from "react";

type Props = {
    nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data, isLoading } = useActiveClaimCondition(
        contract,
        nft.metadata.id // Token ID required for ERC1155 contracts here
    );

    const [quantity, setQuantity] = useState(1); // 保存当前选择的数量
    const [isProcessing, setIsProcessing] = useState(false); // 交易处理中状态

    // 动态计算总价
    const totalPrice = !isLoading && data
        ? ethers.utils.formatEther(ethers.BigNumber.from(data.price).mul(quantity))
        : "Loading...";

    // 购买逻辑
    const handleTransaction = async () => {
        if (!contract || isProcessing) return;

        setIsProcessing(true);
        try {
            await contract.erc1155.claim(nft.metadata.id, quantity); // 根据数量购买
            alert(`Successfully purchased ${quantity} ${nft.metadata.name}!`);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed, please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    // 数量选择逻辑
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setQuantity(isNaN(value) || value < 1 ? 1 : value); // 防止无效输入
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
                <>
                    <Text textAlign={"center"} my={5}>
                        Cost per NFT: {ethers.utils.formatEther(data.price)} {data.currencyMetadata.symbol}
                    </Text>
                    <Text textAlign={"center"} my={5}>
                        Total Cost: {totalPrice} {data.currencyMetadata.symbol}
                    </Text>
                </>
            ) : (
                <Text>Loading...</Text>
            )}

            {/* 数量选择和交易按钮 */}
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
            >
                Purchase
            </Button>
        </Card>
    );
}