import { Text, Card } from "@chakra-ui/react";
import { MediaRenderer, useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import NFTQuantityTransaction from "./NFTQuantityTransaction";

type Props = {
    nft: NFT;
    onTotalPriceChange?: (nftId: string, totalPrice: string) => void; // 新增回调
};

export default function NFTComponent({ nft, onTotalPriceChange }: Props) {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data, isLoading } = useActiveClaimCondition(
        contract,
        nft.metadata.id,
    );

    const [quantity, setQuantity] = React.useState(1); // 数量状态

    // 更新总价
    React.useEffect(() => {
        if (data && onTotalPriceChange) {
            const totalPrice = ethers.utils.formatEther(data.price.mul(quantity)); // 计算总价
            onTotalPriceChange(nft.metadata.id, totalPrice); // 传递总价
        }
    }, [quantity, data, nft.metadata.id, onTotalPriceChange]);

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
                        Total Price: {ethers.utils.formatEther(data.price.mul(quantity))}{" "}
                        {data?.currencyMetadata.symbol}
                    </Text>
                </>
            ) : (
                <Text>Loading...</Text>
            )}

            {/* 数量选择器 */}
            <NFTQuantityTransaction
                initialQuantity={1}
                onTransaction={(selectedQuantity) => setQuantity(selectedQuantity)} // 动态更新数量
                onTransactionConfirmed={() => alert("Transaction confirmed!")}
                buttonText="Buy"
            />
        </Card>
    );
}