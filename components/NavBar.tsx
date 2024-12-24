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
    Box, 
    Text, 
    Spinner 
} from "@chakra-ui/react";
import { ConnectWallet, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import styles from './NavBar.module.scss';

const NFT_CONTRACTS = [
    "0x605f710b66Cc10A0bc0DE7BD8fe786D5C9719179", // 合約地址 1
    "0xf747821D7A019B0C8c11824a141D2EA6De89cA34", // 合約地址 2
];

export default function NavBar() {
    const address = useAddress();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // 獲取所有合約的實例
    const contracts = NFT_CONTRACTS.map((contractAddress) => useContract(contractAddress));

    // 統一處理多個合約的 NFT 資料
    const ownedNFTsList = contracts.map(({ contract }) => useOwnedNFTs(contract, address));

    // 確保地址已連接
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

            {/* Drawer for Connect Wallet and NFTs */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent width="350px">
                    <DrawerCloseButton />
                    <DrawerBody display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" pt={10}>
                        <ConnectWallet className={styles.connectWallet} />
                        <Box mt={6} w="100%">
                            <Heading size="md" textAlign="center" mb={4}>
                                Your NFTs
                            </Heading>
                            {NFT_CONTRACTS.map((contractAddress, index) => {
                                const { data: ownedNFTs, isLoading } = ownedNFTsList[index];
                                return (
                                    <Box key={contractAddress} mt={4}>
                                        <Heading size="sm" textAlign="center" mb={2}>
                                            Contract: {contractAddress}
                                        </Heading>
                                        {isLoading ? (
                                            <Spinner size="lg" />
                                        ) : ownedNFTs && ownedNFTs.length > 0 ? (
                                            ownedNFTs.map((nft) => (
                                                <Box
                                                    key={`${contractAddress}-${nft.metadata.id}`}
                                                    border="1px solid #e2e8f0"
                                                    borderRadius="md"
                                                    p={4}
                                                    mb={4}
                                                    textAlign="center"
                                                >
                                                    <img
                                                        src={nft.metadata.image}
                                                        alt={nft.metadata.name}
                                                        style={{
                                                            width: "100px",
                                                            height: "100px",
                                                            borderRadius: "8px",
                                                            margin: "0 auto",
                                                        }}
                                                    />
                                                    <Text fontWeight="bold" mt={2}>
                                                        {nft.metadata.name}
                                                    </Text>
                                                    <Text fontSize="sm" color="gray.500">
                                                        Token ID: {nft.metadata.id}
                                                    </Text>
                                                </Box>
                                            ))
                                        ) : (
                                            <Text>No NFTs found.</Text>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Container>
    );
}