import { Container, Flex } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "./NavBar.module.scss";

export default function NavBar() {
  const address = useAddress(); // 获取钱包地址

  // 如果未连接钱包，不渲染 NavBar
  if (!address) {
    return null;
  }

  return (
    <div className={styles.navBarContainer}>
      <div className={styles.navBar}>
        {/* Logo */}
        <a href="/" className={styles.logo}>
          BaseBot
        </a>

        {/* Navigation Links and Wallet */}
        <div className={styles.navLinks}>
          <a href="/supplier" className={styles.navLink}>
            Supplier
          </a>
          <div>
            <ConnectWallet className={styles.walletButton} />
          </div>
        </div>
      </div>
    </div>
  );
}