import React from "react";
import styles from "./LoginSection.module.scss";
import { useAddress, useMetamask } from "@thirdweb-dev/react";

const LoginSection: React.FC = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

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
            onClick={connectWithMetamask}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginSection;