import React from 'react';
import styles from './LoginSection.module.scss';

const LoginSection = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome to Binance Dapp</h1>
        <p className={styles.description}>
          Log in to manage your assets, explore the marketplace, and unlock new opportunities.
        </p>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Enter your wallet address"
            className={styles.input}
          />
          <button className={styles.loginButton}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;