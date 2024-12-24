import { 
    Container, 
    Flex, 
    Heading, 
    Link, 
    Drawer, 
    DrawerBody, 
    DrawerFooter, 
    DrawerHeader, 
    DrawerOverlay, 
    DrawerContent, 
    DrawerCloseButton, 
    Button, 
    useDisclosure 
} from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useState } from "react";
import styles from './NavBar.module.scss';

export default function NavBar() {
    const address = useAddress();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [placement, setPlacement] = useState<"top" | "right" | "bottom" | "left">("right"); // Corrected type

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
                    <Button onClick={onOpen} className={styles.connectWalletButton}>
                        Connect Wallet
                    </Button>
                </Flex>
            </Flex>

            {/* Drawer Component */}
            <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Connect Your Wallet</DrawerHeader>
                    <DrawerBody>
                        {/* Integrate ConnectWallet Component */}
                        <ConnectWallet className={styles.connectWallet} />
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Container>
    );
}