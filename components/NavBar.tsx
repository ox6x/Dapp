import { useState } from "react";
import { Container, Flex, Heading, Link, Box, Button, Collapse } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from './NavBar.module.scss';

export default function NavBar() {
    const address = useAddress();
    const [isWalletPanelOpen, setWalletPanelOpen] = useState(false);

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
                    <Button
                        onClick={() => setWalletPanelOpen(!isWalletPanelOpen)}
                        size="sm"
                        ml={4}
                        colorScheme="blue"
                    >
                        Wallet Panel
                    </Button>
                </Flex>
            </Flex>

            {/* Collapsible Wallet Panel */}
            <Collapse in={isWalletPanelOpen} animateOpacity>
                <Box
                    p={4}
                    mt={2}
                    rounded="md"
                    shadow="md"
                    bg="gray.50"
                    borderWidth="1px"
                    borderColor="gray.200"
                >
                    <ConnectWallet />
                </Box>
            </Collapse>
        </Container>
    );
}