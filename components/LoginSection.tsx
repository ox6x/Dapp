import React from "react";
import styles from "./LoginSection.module.scss";
import { useAddress, useMetamask } from "@thirdweb-dev/react";

const LoginSection: React.FC = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  const handleConnectWallet = () => {
    connectWithMetamask(); // 確保不傳入任何參數
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginTitle}>Welcome to Binance DApp</div>
        <div className={styles.loginDescription}>
          Connect your wallet to start exploring the Binance ecosystem.
        </div>
        {!address && (
          <button
            className={styles.loginButton}
            onClick={handleConnectWallet} // 使用封裝的函數
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginSection;