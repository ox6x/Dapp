import styles from "./NavBar.module.scss";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function NavBar() {
  const address = useAddress(); // 获取钱包地址

  if (!address) {
    return null; // 如果未连接钱包，不渲染 NavBar
  }

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div className={styles.heading}>
          <a href="/">BaseBot</a>
        </div>
        <div className={styles.nav-links}>
          <a href="/supplier">Supplier</a>
          <button className="wallet-btn">
            <ConnectWallet />
          </button>
        </div>
      </div>
    </div>
  );
}