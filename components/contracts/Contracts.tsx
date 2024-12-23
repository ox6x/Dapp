import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS, STAKING_ADDRESS, REWARDS_ADDRESS } from "../../const/addresses";

export const Contracts = () => {
  const address = useAddress();

  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);
  const { data: equippedTools } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);

  return {
    ownedTools,
    loadingOwnedTools,
    equippedTools,
    rewardBalance,
  };
};
