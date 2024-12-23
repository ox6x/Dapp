import { Flex, Link, Box, Text } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "./NavBar.module.scss"; // 引用 SCSS 模块

export default function NavBar() {
    const address = useAddress(); // 获取钱包地址

    // 如果未连接钱包，不渲染 NavBar
    if (!address) {
        return null;
    }

    return (
        <Box className={styles.navbar}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"} maxW="1200px" mx="auto">
                {/* 网站标题 */}
                <Link href="/" className={styles.navItem} style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    BaseBot
                </Link>

                {/* 导航链接 */}
                <Flex direction="row" alignItems="center">
                    <Link href="/supplier" className={styles.navItem}>
                        Supplier
                    </Link>
                </Flex>

                {/* 连接钱包 */}
                <Flex alignItems="center">
                    <Text className={styles.navItem} style={{ marginRight: "1rem" }}>
                        {address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : ""}
                    </Text>
                    <button className={styles.connectButton}>
                        <ConnectWallet />
                    </button>
                </Flex>
            </Flex>
        </Box>
    );
}