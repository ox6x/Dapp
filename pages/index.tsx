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
  const [ownedFarmers, setOwnedFarmers] = useState([]);
  const [loadingOwnedFarmers, setLoadingOwnedFarmers] = useState(true);
  const [ownedTools, setOwnedTools] = useState([]);
  const [loadingOwnedTools, setLoadingOwnedTools] = useState(true);
  const [equippedTools, setEquippedTools] = useState([]);
  const [rewardBalanceData, setRewardBalanceData] = useState(null);

  const fetchContractsData = useCallback(async (index: number) => {
    const { contract: toolsContract } = useContract(ADDRESSES[`TOOLS_${index}`]);
    const { contract: stakingContract } = useContract(ADDRESSES[`STAKING_${index}`]);
    const { contract: rewardContract } = useContract(ADDRESSES[`REWARDS_${index}`]);
    
    const ownedFarmersData = await useOwnedNFTs(toolsContract, address);
    const ownedToolsData = await useOwnedNFTs(toolsContract, address);
    const equippedToolsData = await useContractRead(stakingContract, "getStakeInfo", [address]);
    const rewardBalanceData = await useContractRead(rewardContract, "balanceOf", [address]);

    setOwnedFarmers(ownedFarmersData);
    setLoadingOwnedFarmers(false);

    setOwnedTools(ownedToolsData);
    setLoadingOwnedTools(false);

    setEquippedTools(equippedToolsData);

    setRewardBalanceData(rewardBalanceData);
  }, [address]);

  const handleSwitchContract = (index: number) => {
    setContractIndex(index);
    setLoadingOwnedFarmers(true);
    setLoadingOwnedTools(true);
    fetchContractsData(index);
  };

  useEffect(() => {
    fetchContractsData(contractIndex);
  }, [contractIndex, fetchContractsData]);

  useEffect(() => {
    if (rewardBalanceData) {
      setRewardBalance(rewardBalanceData);
    }
  }, [rewardBalanceData]);

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