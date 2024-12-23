import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import { TOOLS_BB_ADDRESS, STAKING_BB_ADDRESS, REWARDS_BB_ADDRESS } from "../../const/addresses";

export const BBContracts = () => {
  const address = useAddress();

  const { contract: toolsContract } = useContract(TOOLS_BB_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_BB_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_BB_ADDRESS);

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