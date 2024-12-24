import {
  Container,
  Flex,
  Heading,
  Link,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import { useState } from "react";
import styles from './NavBar.module.scss';

export default function NavBar() {
    const address = useAddress();
    const [isOpen, setIsOpen] = useState(false);

    if (!address) {
        return null;
    }

    const toggleWallet = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Container className={styles.navBarContainer}>
            <Flex className={styles.navBarFlex}>
                <Heading className={styles.heading}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        BaseBot
                    </Link>
                </Heading>
                <Flex alignItems={"center"} justifyContent={"flex-end"} w="auto">
                    <Link href="/supplier" className={styles.link}>
                        Supplier
                    </Link>
                    {/* 錢包圖標，點擊後顯示 ConnectWallet */}
                    <IconButton 
                        icon={<FaWallet />} 
                        aria-label="Open Wallet" 
                        onClick={toggleWallet} 
                        className={styles.walletIconButton} 
                        variant="ghost"
                    />
                </Flex>
            </Flex>

            {/* 顯示 ConnectWallet 當 isOpen 為 true 時 */}
            {isOpen && (
                <Box
                    className={styles.walletBox}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={6}
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                    borderRadius="8px"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    backgroundColor="white"
                >
                    <ConnectWallet className={styles.connectWallet} />
                    {/* 可選：添加一個關閉按鈕 */}
                    <button onClick={toggleWallet}>Close</button>
                </Box>
            )}
        </Container>
    );
}