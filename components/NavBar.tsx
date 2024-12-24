import {
  Container,
  Flex,
  Heading,
  Link,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import styles from './NavBar.module.scss';

export default function NavBar() {
    const address = useAddress();
    const { isOpen, onOpen, onClose } = useDisclosure();

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
                    {/* 隱藏的按鈕 */}
                    <IconButton 
                        icon={<FaWallet />} 
                        aria-label="Open Wallet" 
                        onClick={onOpen} 
                        className={styles.walletIconButton} 
                        variant="ghost"
                    />
                </Flex>
            </Flex>

            {/* Drawer for Connect Wallet */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent
                    style={{
                        width: '400px', // 設置寬度為 400px
                        borderRadius: '10px', // 添加圓角
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 添加陰影
                    }}
                >
                    <DrawerCloseButton />
                    <DrawerBody display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" pt={10}>
                        <ConnectWallet className={styles.connectWallet} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Container>
    );
}