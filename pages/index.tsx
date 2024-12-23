import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { ADDRESSES } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Container } from "@chakra-ui/react";

import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: farmerContract } = useContract(ADDRESSES.FARMER);
  const { contract: toolsContract } = useContract(ADDRESSES.TOOLS_0); // 根據需求更改索引
  const { contract: stakingContract } = useContract(ADDRESSES.STAKING_0);
  const { contract: rewardContract } = useContract(ADDRESSES.REWARDS_0);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmerContract, address);
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);

  const { data: equippedTools } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);

  if (!address) {
    return <LoginSection />;
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
      <FarmerSection ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} />
      <InventorySection ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} />
      <EquippedSection equippedTools={equippedTools} />
    </Container>
  );
};

export default Home;