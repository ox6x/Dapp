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
    Button, 
    IconButton, 
    Image, 
    Text 
} from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import styles from './NavBar.module.scss';

export default function NavBar({ ownedFarmers }: { ownedFarmers: any[] }) {
    const address = useAddress();
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!address) {
        return null;
    }

    // 获取用户拥有的第一个 Farmer NFT
    const firstFarmer = ownedFarmers?.[0];

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
                        {/* 如果用户有 Farmer NFT，显示头像 */}
                        {firstFarmer ? (
                            <Flex direction="column" align="center" mb={6}>
                                <Image
                                    src={firstFarmer.metadata.image}
                                    alt={firstFarmer.metadata.name || "Farmer Avatar"}
                                    boxSize="100px"
                                    borderRadius="full"
                                    objectFit="cover"
                                    mb={3}
                                />
                                <Text fontWeight="bold" fontSize="lg">
                                    {firstFarmer.metadata.name || "Unknown"}
                                </Text>
                            </Flex>
                        ) : (
                            <Text fontWeight="medium" color="gray.500" mb={6}>
                                No Farmer Avatar
                            </Text>
                        )}
                        {/* Connect Wallet Button */}
                        <ConnectWallet className={styles.connectWallet} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Container>
    );
}