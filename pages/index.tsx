import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS, TOOLS_ADDRESS, setVersion } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Container, Button, Flex } from "@chakra-ui/react";

import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  const [version, setVersionState] = useState<"V1" | "V2">('V1');
  const [farmerContract, setFarmerContract] = useState(null);
  const [toolsContract, setToolsContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [rewardContract, setRewardContract] = useState(null);
  const address = useAddress();

  useEffect(() => {
    const initializeContracts = async () => {
      const farmer = await useContract(FARMER_ADDRESS);
      const tools = await useContract(TOOLS_ADDRESS);
      const staking = await useContract(STAKING_ADDRESS);
      const rewards = await useContract(REWARDS_ADDRESS);
      setFarmerContract(farmer);
      setToolsContract(tools);
      setStakingContract(staking);
      setRewardContract(rewards);
    };

    initializeContracts();
  }, [version]);

  const handleVersionChange = (newVersion: "V1" | "V2") => {
    setVersionState(newVersion);
    setVersion(newVersion);
  };

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
      <Flex mb={4} justifyContent="center">
        <Button
          onClick={() => handleVersionChange("V1")}
          isActive={version === "V1"}
          colorScheme={version === "V1" ? "blue" : "gray"}
          mr={2}
        >
          ETH
        </Button>
        <Button
          onClick={() => handleVersionChange("V2")}
          isActive={version === "V2"}
          colorScheme={version === "V2" ? "blue" : "gray"}
        >
          bETH
        </Button>
      </Flex>
      <FarmerSection ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} />
      <InventorySection ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} />
      <EquippedSection equippedTools={equippedTools} />
    </Container>
  );
};

export default Home;