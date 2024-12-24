import React from 'react';
import styles from './LoginSection.module.scss';
import { ConnectWallet } from "@thirdweb-dev/react";

const LoginSection = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {/* 主標題 */}
        <h1 className={styles.title}>Welcome to Your DApp</h1>
        {/* 描述文字 */}
        <p className={styles.description}>
          Connect your wallet to securely access your dashboard and manage your digital assets.
        </p>
        {/* Connect Wallet 按鈕 */}
        <div className={styles.form}>
          <ConnectWallet
            className={styles.connectWalletButton}
            theme="light" /* 按鈕主題 */
            btnTitle="Connect Wallet" /* 自定義按鈕標題 */
          />
        </div>
      </div>
    </div>
  );
};

export default LoginSection;