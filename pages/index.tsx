import { useState, useEffect, useCallback } from "react";
import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { ADDRESSES } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Container, Select } from "@chakra-ui/react";
import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";

const Home: NextPage = () => {
  const address = useAddress();
  const [contractIndex, setContractIndex] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(null);
  const { contract: toolsContract } = useContract(ADDRESSES[`TOOLS_${contractIndex}`]);
  const { contract: stakingContract } = useContract(ADDRESSES[`STAKING_${contractIndex}`]);
  const { contract: rewardContract } = useContract(ADDRESSES[`REWARDS_${contractIndex}`]);
  const { data: ownedFarmersData, isLoading: loadingOwnedFarmers } = useOwnedNFTs(toolsContract, address);
  const { data: ownedToolsData, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);
  const { data: equippedToolsData } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const { data: rewardBalanceData } = useContractRead(rewardContract, "balanceOf", [address]);

  useEffect(() => {
    if (rewardBalanceData) {
      setRewardBalance(rewardBalanceData);
    }
  }, [rewardBalanceData, contractIndex]); // 添加 contractIndex 作为依赖项

  if (!address) {
    return <LoginSection />;
  }

  if (loadingOwnedFarmers) {
    return <LoadingScreen />;
  }

  if (ownedFarmersData?.length === 0) {
    return (
      <Container maxW={"container.sm"} px={4}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container maxW={"container.sm"} px={4} py={6}>
      <Select onChange={(e) => setContractIndex(Number(e.target.value))} value={contractIndex}>
        <option value={0}>Contract 0</option>
        <option value={1}>Contract 1</option>
        {/* 根據需要添加更多選項 */}
      </Select>
      <FarmerSection ownedFarmers={ownedFarmersData || []} rewardBalance={rewardBalance} />
      <InventorySection ownedTools={ownedToolsData || []} loadingOwnedTools={loadingOwnedTools} contractIndex={contractIndex} />
      <EquippedSection equippedTools={equippedToolsData || []} contractIndex={contractIndex} />
    </Container>
  );
};

export default Home;