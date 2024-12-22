import { Text, Card } from "@chakra-ui/react";
import { MediaRenderer, useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import NFTQuantityTransaction from "./NFTQuantityTransaction"; // 引入封装组件
import { useState } from "react"; // 引入 useState

type Props = {
    nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data, isLoading } = useActiveClaimCondition(
        contract,
        nft.metadata.id, // Token ID required for ERC1155 contracts here
    );

    const [quantity, setQuantity] = useState(1); // 设置数量的状态

    // 购买逻辑
    const handleTransaction = async (selectedQuantity: number) => {
        if (!contract) return;

        try {
            await contract.erc1155.claim(nft.metadata.id, selectedQuantity); // 根据数量进行购买
            alert(`Successfully purchased ${selectedQuantity} ${nft.metadata.name}!`);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed, please try again.");
        }
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
                        Cost per NFT: {ethers.utils.formatEther(data?.price)}{" " + data?.currencyMetadata.symbol}
                    </Text>
                    <Text textAlign={"center"} my={5}>
                        Total Cost:{" "}
                        {ethers.utils.formatEther(
                            ethers.BigNumber.from(data?.price).mul(quantity)
                        )}{" " + data?.currencyMetadata.symbol}
                    </Text>
                </>
            ) : (
                <Text>Loading...</Text>
            )}

            {/* 使用封装组件实现数量选择和动态价格显示 */}
            <NFTQuantityTransaction
                initialQuantity={1}
                onQuantityChange={(newQuantity: number) => setQuantity(newQuantity)} // 动态更新数量
                onTransaction={handleTransaction} // 动态交易逻辑
                onTransactionConfirmed={() => alert("Transaction confirmed!")} // 成功提示
            />
        </Card>
    );
}