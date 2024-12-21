import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import NFT from "./NFT";

export default function Store() {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data: nfts } = useNFTs(contract);
    console.log(nfts);

    return (
        <div>
            <div>
                <Link href="/store">
                    <button>Back</button>
                </Link>
            </div>
            <h1>Store</h1>
            <p>Purchase tools with $CARROTS to increase your earnings.</p>
            {!nfts ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : (
                <div>
                    {nfts?.map((nftItem) => (
                        <NFT 
                            key={nftItem.metadata.id}
                            nft={nftItem}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}