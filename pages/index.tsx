import { useAddress, useContractRead, useOwnedNFTs, useContract } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { getToolsAddress, FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Container, Button, Flex } from "@chakra-ui/react";

import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";
import { useContractState } from "../contexts/ContractContext";

const Home: NextPage = () => {
  const { state, dispatch } = useContractState();
  const { version, contract: toolsContract } = state;
  const address = useAddress();

  const handleVersionChange = (newVersion: "V1" | "V2") => {
    dispatch({ type: "SET_VERSION", version: newVersion });
  };

  const { contract: farmerContract } = useContract(FARMER_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmerContract, address);
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);

  const { data: equippedTools, error: equippedToolsError } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const { data: rewardBalance, error: rewardBalanceError } = useContractRead(rewardContract, "balanceOf", [address]);

  useEffect(() => {
    if (equippedToolsError) {
      console.error("Error fetching equipped tools:", equippedToolsError);
    }
    if (rewardBalanceError) {
      console.error("Error fetching reward balance:", rewardBalanceError);
    }
  }, [equippedToolsError, rewardBalanceError]);

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
      <Flex justifyContent="space-between" mb={4}>
        <Button onClick={() => handleVersionChange("V1")} width="fit-content">V1</Button>
        <Button onClick={() => handleVersionChange("V2")} width="fit-content">V2</Button>
      </Flex>
      <FarmerSection ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} />
      <InventorySection ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} />
      <EquippedSection equippedTools={equippedTools} />
    </Container>
  );
};

export default Home;