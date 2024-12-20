import {
    MediaRenderer,
    Web3Button,
    useAddress,
    useContract,
    useContractRead,
    useNFT,
} from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useState, useMemo } from "react";

interface EquippedProps {
    tokenId: number;
}

export const Equipped = ({ tokenId }: EquippedProps) => {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { data: nft } = useNFT(toolContract, tokenId);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);
    const { data: claimableRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [tokenId, address]
    );

    const [quantity, setQuantity] = useState<number>(1);

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(Math.max(1, newQuantity));
    };

    const equipped = useMemo(
        () =>
            claimableRewards ? ethers.utils.formatUnits(claimableRewards[0], 0) : "0",
        [claimableRewards]
    );

    const rewards = useMemo(
        () =>
            claimableRewards ? ethers.utils.formatUnits(claimableRewards[1], 18) : "0",
        [claimableRewards]
    );

    return (
        <>
            {nft && (
                <>
                    <div>{nft.metadata.name}</div>
                    <div>Equipped: {equipped}</div>
                    <div>
                        <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                handleQuantityChange(isNaN(value) ? 1 : value);
                            }}
                        />
                        <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
                    </div>
                    <Web3Button
                        contractAddress={STAKING_ADDRESS}
                        action={async (contract) => {
                            try {
                                await contract.call("withdraw", [tokenId, quantity]);
                            } catch (error) {
                                console.error("Withdraw failed:", error);
                            }
                        }}
                    >
                        Unequip {quantity}
                    </Web3Button>
                    <div>
                        <div>Claimable $CARROT:</div>
                        <div>{rewards}</div>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS}
                            action={async (contract) => {
                                try {
                                    await contract.call("claimRewards", [tokenId]);
                                } catch (error) {
                                    console.error("Claim rewards failed:", error);
                                }
                            }}
                        >
                            Claim $CARROT
                        </Web3Button>
                    </div>
                </>
            )}
        </>
    );
};