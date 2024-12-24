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
    IconButton 
} from "@chakra-ui/react";
import { ConnectWallet, useAddress, useContract, useNFTs, useTokenBalance } from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import styles from './NavBar.module.scss';
import { useState, useEffect } from "react";
import { NFT } from "@thirdweb-dev/sdk";

const NFT_CONTRACT_ADDRESS = "0x605f710b66Cc10A0bc0DE7BD8fe786D5C9719179";
const TOKEN_CONTRACT_ADDRESS = "0x0Ad1149eec66A20cB69D114Aec704626C22b7852";

export default function NavBar() {
    const address = useAddress();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // State to hold user NFTs and token balances
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [tokenBalance, setTokenBalance] = useState<string>("0");

    // Load NFT and Token data
    const { contract: nftContract } = useContract(NFT_CONTRACT_ADDRESS, "nft-collection");
    const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS, "token");

    const { data: nftData } = useNFTs(nftContract, { start: 0, count: 50 });
    const { data: tokenData } = useTokenBalance(tokenContract, address);

    useEffect(() => {
        if (nftData) {
            setNfts(nftData);
        }
        if (tokenData) {
            setTokenBalance(tokenData.displayValue || "0");
        }
    }, [nftData, tokenData]);

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

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" pt={10}>
                        <ConnectWallet className={styles.connectWallet} />
                        <Heading size="md" mt={6}>Your Assets</Heading>
                        
                        <Flex mt={4} flexDirection="column" alignItems="center">
                            <Heading size="sm">Token Balance</Heading>
                            <p>{tokenBalance} TOKEN_SYMBOL</p>
                        </Flex>

                        <Flex mt={6} flexDirection="column" alignItems="center" w="full">
                            <Heading size="sm">Your NFTs</Heading>
                            {nfts && nfts.length > 0 ? (
                                <Flex flexWrap="wrap" justifyContent="center">
                                    {nfts.map((nft) => (
                                        <Flex 
                                            key={nft.metadata.id} 
                                            flexDirection="column" 
                                            alignItems="center" 
                                            borderWidth="1px" 
                                            borderRadius="lg" 
                                            m={2} 
                                            p={2} 
                                            w="150px"
                                        >
                                            <img 
                                                src={nft.metadata.image ?? undefined} // 使用 null 合并操作符处理 null 值
                                                alt={
                                                    nft.metadata.name
                                                        ? nft.metadata.name.toString() // 将 number 转换为 string
                                                        : "NFT Image"
                                                }
                                                style={{ width: "100%", borderRadius: "8px" }} 
                                            />
                                            <p style={{ marginTop: "8px", fontSize: "14px", textAlign: "center" }}>
                                                {nft.metadata.name
                                                    ? nft.metadata.name.toString() // 转换为 string
                                                    : "Unnamed NFT"}
                                            </p>
                                        </Flex>
                                    ))}
                                </Flex>
                            ) : (
                                <p>No NFTs Found</p>
                            )}
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Container>
    );
}