import { Text, Card } from "@chakra-ui/react";
import { MediaRenderer, useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import NFTQuantityTransaction from "./NFTQuantityTransaction"; // 引入封装组件

type Props = {
    nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data, isLoading } = useActiveClaimCondition(
        contract,
        nft.metadata.id, // Token ID required for ERC1155 contracts
    );

    const [quantity, setQuantity] = React.useState(1); // 新增状态存储数量

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

    // 动态计算总价
    const totalPrice =
        data && quantity > 0
            ? ethers.utils.formatEther(data.price.mul(quantity)) // 单价 × 数量
            : "0";

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
                    <Text textAlign={"center"} my={2}>
                        Cost per NFT: {ethers.utils.formatEther(data?.price)}{" "}
                        {data?.currencyMetadata.symbol}
                    </Text>
                    <Text textAlign={"center"} my={2} fontWeight="bold">
                        Total Price: {totalPrice} {data?.currencyMetadata.symbol}
                    </Text>
                </>
            ) : (
                <Text>Loading...</Text>
            )}

            {/* 数量选择器 */}
            <NFTQuantityTransaction
                initialQuantity={1}
                onTransaction={handleTransaction} // 交易逻辑
                onTransactionConfirmed={() => alert("Transaction confirmed!")} // 成功提示
                onTransaction={(selectedQuantity) => setQuantity(selectedQuantity)} // 动态更新数量
            />
        </Card>
    );
}