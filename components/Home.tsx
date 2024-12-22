import {
  ConnectWallet,
  MediaRenderer,
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
} from "../const/addresses";
import { ClaimFarmer } from "./ClaimFarmer";
import { Inventory } from "./Inventory";
import { Equipped } from "./Equipped";
import { BigNumber, ethers } from "ethers";
import styles from "./Home.module.scss"; // 引入 SCSS 文件

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: farmercontract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmercontract, address);
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);

  const { data: equippedTools } = useContractRead(stakingContract, "getStakeInfo", [address]);

  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);

  if (!address) {
    return (
      <div className={styles.container}>
        <div className={styles.center}>
          <h1 className={styles.heading}>Welcome to Crypto Farm</h1>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (loadingOwnedFarmers) {
    return (
      <div className={styles.container}>
        <div className={styles.center}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (ownedFarmers?.length === 0) {
    return (
      <div className={styles.container}>
        <ClaimFarmer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.subheading}>Farmer</h2>
          {ownedFarmers?.map((nft) => (
            <div key={nft.metadata.id} className={styles.imageBox}>
              <MediaRenderer src={nft.metadata.image} height="150px" width="100%" />
            </div>
          ))}
          <p className={styles.text}>
            <strong>bBNB Balance:</strong>
          </p>
          {rewardBalance && (
            <p className={styles.text}>{ethers.utils.formatUnits(rewardBalance, 18)}</p>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.subheading}>Inventory</h2>
          <div className={styles.skeleton}>
            <Inventory nft={ownedTools} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.subheading}>Equipped</h2>
          {equippedTools &&
            equippedTools[0].map((nft: BigNumber) => (
              <Equipped key={nft.toNumber()} tokenId={nft.toNumber()} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;