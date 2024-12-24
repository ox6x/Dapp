import { Container, Flex, Heading, Link, Box } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useState } from "react";
import styles from './NavBar.module.scss';

export default function NavBar() {
    const address = useAddress();
    const [isWalletVisible, setWalletVisible] = useState(false);

    if (!address) {
        return null;
    }

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

                    {/* Toggle for wallet */}
                    <Box
                        onClick={() => setWalletVisible(!isWalletVisible)}
                        className={styles.walletToggle}
                    ></Box>

                    {/* Wallet sliding container */}
                    <Box
                        className={`${styles.walletContent} ${
                            isWalletVisible ? styles.visible : ""
                        }`}
                    >
                        <ConnectWallet className={styles.connectWallet} />
                    </Box>
                </Flex>
            </Flex>
        </Container>
    );
}