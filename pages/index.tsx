import { useState } from "react";
import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { ADDRESSES } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Container, Button, Select } from "@chakra-ui/react";

import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";

const Home: NextPage = () => {
  const address = useAddress();
  const [contractIndex, setContractIndex] = useState(0);

  const handleSwitchContract = (index: number) => {
    setContractIndex(index);
  };

  const { contract: farmerContract } = useContract(ADDRESSES.FARMER);
  const { contract: toolsContract } = useContract(ADDRESSES[`TOOLS_${contractIndex}`]);
  const { contract: stakingContract } = useContract(ADDRESSES[`STAKING_${contractIndex}`]);
  const { contract: rewardContract } = useContract(ADDRESSES[`REWARDS_${contractIndex}`]);

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
      <Select onChange={(e) => handleSwitchContract(Number(e.target.value))} value={contractIndex}>
        <option value={0}>Contract 0</option>
        <option value={1}>Contract 1</option>
        {/* 根據需要添加更多選項 */}
      </Select>
      <FarmerSection ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} />
      <InventorySection ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} contractIndex={contractIndex} />
      <EquippedSection equippedTools={equippedTools} contractIndex={contractIndex} />
    </Container>
  );
};

export default Home;