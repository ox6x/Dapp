import React from 'react';
import styles from './LoginSection.module.scss';

const LoginSection = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {/* 主標題 */}
        <h1 className={styles.title}>Welcome to Binance DApp</h1>
        {/* 描述文字 */}
        <p className={styles.description}>
          Log in to access your dashboard and manage your digital assets.
        </p>
        {/* 登錄按鈕 */}
        <div className={styles.form}>
          <button className={styles.loginButton}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;