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
import { Container, Select } from "@chakra-ui/react";

import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";
import { useState, useEffect } from "react";
import styles from './index.module.scss'; // 引入 SCSS 文件

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
    return <LoadingScreen />;
  }

  if (ownedFarmers?.length === 0) {
    return (
      <Container className={styles.container} maxW={"container.sm"} px={4}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container className={styles.container} maxW={"container.sm"} px={4} py={6}>
      {/* 下拉選單：位於頂部 */}
      <Select
        className={styles.select}
        value={version}
        onChange={handleVersionChange}
        width="5ch"
        mb={4}
      >
        <option value="V1">ETH</option>
        <option value="V2">bETH</option>
      </Select>

      {/* 各個區塊 */}
      <div className={styles.section}>
        <FarmerSection ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} />
      </div>
      <div className={styles.section}>
        <InventorySection ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} />
      </div>
      <div className={styles.section}>
        <EquippedSection equippedTools={equippedTools} />
      </div>
    </Container>
  );
};

export default Home;