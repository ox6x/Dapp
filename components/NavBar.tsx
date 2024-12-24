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
                    {/* Wallet Toggle */}
                    <Box
                        position="relative"
                        onClick={() => setWalletVisible(!isWalletVisible)}
                        className={styles.walletToggle}
                        cursor="pointer"
                    >
                        {/* Wallet Button Preview */}
                        <Box
                            position="absolute"
                            top={isWalletVisible ? "0" : "-60px"} // Adjust height to slide in/out
                            transition="top 0.3s ease-in-out"
                            bg="gray.100"
                            p={2}
                            rounded="md"
                            shadow="md"
                            zIndex="10"
                        >
                            <ConnectWallet className={styles.connectWallet} />
                        </Box>
                        <Box
                            bg="gray.300"
                            h="10px"
                            w="100px"
                            rounded="md"
                            mt="10px"
                            _hover={{ bg: "gray.400" }}
                        />
                    </Box>
                </Flex>
            </Flex>
        </Container>
    );
}