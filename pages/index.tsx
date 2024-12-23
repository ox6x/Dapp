import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS, TOOLS_ADDRESS, TOOLS_BB_ADDRESS, REWARDS_BB_ADDRESS, STAKING_BB_ADDRESS } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Container } from "@chakra-ui/react";

import LoginSection from "../components/LoginSection"; // 新增導入
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: farmercontract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: toolsBBContract } = useContract(TOOLS_BB_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: stakingBBContract } = useContract(STAKING_BB_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);
  const { contract: rewardsBBContract } = useContract(REWARDS_BB_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmercontract, address);
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);
  const { data: ownedToolsBB } = useOwnedNFTs(toolsBBContract, address);

  const { data: equippedTools } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const { data: equippedToolsBB } = useContractRead(stakingBBContract, "getStakeInfo", [address]);
  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);
  const { data: rewardBalanceBB } = useContractRead(rewardsBBContract, "balanceOf", [address]);

  if (!address) {
    return <LoginSection />; // 使用新的 LoginSection 組件
  }

  if (loadingOwnedFarmers) {
    return <LoadingScreen />;
  }

  if (ownedFarmers?.length === 0) {
    return (
      <Container maxW={"container.sm"} px={4}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container maxW={"container.sm"} px={4} py={6}>
      <FarmerSection ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} rewardBalanceBB={rewardBalanceBB} />
      <InventorySection ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} />
      <InventorySection ownedTools={ownedToolsBB} loadingOwnedTools={loadingOwnedTools} />
      <EquippedSection equippedTools={equippedTools} />
      <EquippedSection equippedTools={equippedToolsBB} />
    </Container>
  );
};

export default Home;