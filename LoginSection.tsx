import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "./LoginSection.module.scss";

const LoginSection = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Welcome to Crypto Hub</h1>
        <p className={styles.description}>
          Join us to unlock exclusive rewards and start your Web3 journey effortlessly.
        </p>
        <ConnectWallet className={styles.connectButton} />
      </div>
    </div>
  );
};

export default LoginSection;