import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "./Login.module.scss"; // 引入 SCSS 文件

const Login = () => {
  const address = useAddress();

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        {!address ? (
          <>
            <h1 className={styles.heading}>Welcome to Crypto Farm</h1>
            <ConnectWallet />
          </>
        ) : (
          <h1 className={styles.heading}>Wallet Connected</h1>
        )}
      </div>
    </div>
  );
};

// 不使用佈局
Login.getLayout = (page: React.ReactNode) => <>{page}</>;

export default Login;