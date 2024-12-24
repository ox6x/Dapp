import {
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  FARMER_ADDRESS,
  REWARDS_ADDRESS,
  STAKING_ADDRESS,
  TOOLS_ADDRESS,
  setVersion,
} from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import {
  Container,
  Select,
  VStack,
  Heading,
  Spinner,
  Box,
} from "@chakra-ui/react";

import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  const [version, setVersionState] = useState<"V1" | "V2">("V1");
  const address = useAddress();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVersion = localStorage.getItem("ADDRESS_VERSION") as "V1" | "V2";
      if (savedVersion) {
        setVersionState(savedVersion);
        setVersion(savedVersion);
      }
    }
  }, []);

  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVersion = event.target.value as "V1" | "V2";
    setVersionState(newVersion);
    setVersion(newVersion);
    if (typeof window !== "undefined") {
      localStorage.setItem("ADDRESS_VERSION", newVersion);
      window.location.reload();
    }
  };

  const { contract: farmerContract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(
    farmerContract,
    address
  );
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(
    toolsContract,
    address
  );
  const { data: equippedTools } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);

  if (!address) {
    return <LoginSection />;
  }

  if (loadingOwnedFarmers) {
    return (
      <Container maxW="container.sm" centerContent>
        <VStack spacing={6}>
          <Spinner size="xl" />
          <Heading>Loading Farmers...</Heading>
        </VStack>
      </Container>
    );
  }

  if (ownedFarmers?.length === 0) {
    return (
      <Container maxW="container.sm" py={6}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" px={4} py={6}>
      {/* 下拉選單 */}
      <Box mb={6}>
        <Select
          value={version}
          onChange={handleVersionChange}
          width="auto"
          borderColor="gray.400"
          focusBorderColor="teal.400"
        >
          <option value="V1">ETH</option>
          <option value="V2">bETH</option>
        </Select>
      </Box>

      {/* 各個區塊 */}
      <VStack spacing={6} align="stretch">
        <Box borderWidth={1} borderRadius="md" p={4} shadow="md">
          <FarmerSection ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} />
        </Box>
        <Box borderWidth={1} borderRadius="md" p={4} shadow="md">
          <InventorySection ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} />
        </Box>
        <Box borderWidth={1} borderRadius="md" p={4} shadow="md">
          <EquippedSection equippedTools={equippedTools} />
        </Box>
      </VStack>
    </Container>
  );
};

export default Home;