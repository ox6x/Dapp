import { useState } from 'react';
import { useAddress, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { FARMER_ADDRESS } from "../const/addresses";
import { Container, Select } from "@chakra-ui/react";
import { ClaimFarmer } from "../components/ClaimFarmer";
import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";
import { Contracts0 } from "../components/contracts/Contracts0";
import { Contracts1 } from "../components/contracts/Contracts1";
import RewardBalances from "../components/RewardBalances";  // Import the new component

const Home: NextPage = () => {
  const [currentContract, setCurrentContract] = useState(0);
  const address = useAddress();

  const contracts = currentContract === 0 ? Contracts0() : Contracts1();
  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(FARMER_ADDRESS, address);

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

  const rewardBalances = [
    { label: "bBNB", balance: contracts.rewardBalance0 },
    { label: "BB", balance: contracts.rewardBalance1 },
    // Add more reward balances as needed
  ];

  return (
    <Container maxW={"container.sm"} px={4} py={6}>
      <Select onChange={(e) => setCurrentContract(parseInt(e.target.value, 10))} value={currentContract}>
        <option value={0}>Contracts 0</option>
        <option value={1}>Contracts 1</option>
        {/* You can add more options as you add more contract groups */}
      </Select>
      <FarmerSection ownedFarmers={ownedFarmers} />
      <RewardBalances rewardBalances={rewardBalances} /> {/* Use the new component */}
      <InventorySection ownedTools={contracts.ownedTools} loadingOwnedTools={contracts.loadingOwnedTools} />
      <EquippedSection equippedTools={contracts.equippedTools} />
    </Container>
  );
};

export default Home;