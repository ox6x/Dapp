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
    Box 
} from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import { DrawerEquippedNFT } from "./DrawerEquippedNFT"; // 引入我們的組件
import styles from './NavBar.module.scss';

export default function NavBar() {
    const address = useAddress();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // 示例数据：装备的 NFT tokenId 列表
    const equippedTools = [1, 2, 3];

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
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" pt={10}>
                        {/* Connect Wallet */}
                        <ConnectWallet className={styles.connectWallet} />
                        
                        {/* NFT Display Section */}
                        <Box w="100%" mt={6}>
                            <Heading size="md" mb={4}>Your NFTs</Heading>
                            {equippedTools.length > 0 ? (
                                equippedTools.map((tokenId) => (
                                    <DrawerEquippedNFT key={tokenId} tokenId={tokenId} />
                                ))
                            ) : (
                                <Box>No NFTs Found</Box>
                            )}
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Container>
    );
}