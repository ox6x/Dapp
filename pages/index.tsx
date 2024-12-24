import styles from "./index.module.scss"; // 引入 Binance SCSS
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
import LoginSection from "../components/LoginSection";
import LoadingScreen from "../components/LoadingScreen";
import FarmerSection from "../components/FarmerSection";
import InventorySection from "../components/InventorySection";
import EquippedSection from "../components/EquippedSection";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  // 處理版本狀態
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
      window.location.reload(); // 重新加載頁面以應用更改
    }
  };

  // 合約初始化
  const { contract: farmerContract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  // 加載數據
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

  // 登錄界面
  if (!address) {
    return <LoginSection />;
  }

  // 加載界面
  if (loadingOwnedFarmers) {
    return <LoadingScreen />;
  }

  // 沒有農民的情況
  if (ownedFarmers?.length === 0) {
    return (
      <div className={styles.container}>
        <ClaimFarmer />
      </div>
    );
  }

  // 主頁內容
  return (
    <div className={styles.container}>
      {/* 頂部區域 */}
      <div className={styles.header}>
        <div className={styles.logo}>Binance DApp</div>
        <select
          className={styles.select}
          value={version}
          onChange={handleVersionChange}
        >
          <option value="V1">ETH</option>
          <option value="V2">bETH</option>
        </select>
      </div>

      {/* 各個區塊 */}
      <div className={styles.card}>
        <FarmerSection ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} />
      </div>
      <div className={styles.card}>
        <InventorySection ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} />
      </div>
      <div className={styles.card}>
        <EquippedSection equippedTools={equippedTools} />
      </div>
    </div>
  );
};

export default Home;