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
    Stack, 
    Text, 
    Button, 
    Divider 
} from "@chakra-ui/react";
import { ConnectWallet, useAddress, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import Quantity from "./Quantity";
import styles from './NavBar.module.scss';

export default function NavBar() {
    const address = useAddress();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    const handleClaimClick = async (tokenId: number) => {
        if (!address) {
            console.error("No wallet connected.");
            return;
        }

        try {
            await stakingContract?.call("claimRewards", [tokenId]);
            console.log(`Claimed rewards for token ID ${tokenId}.`);
        } catch (error) {
            console.error("Error claiming rewards:", error);
        }
    };

    const equippedTools = [/* Example data; replace with actual data */];

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
                        <Box w="100%" mt={6}>
                            <Heading size="md" mb={4}>Your Activated NFTs</Heading>
                            {equippedTools.length > 0 ? (
                                equippedTools.map((nft: ethers.BigNumber) => {
                                    const tokenId = nft.toNumber();
                                    const { data: nftData } = useNFT(toolContract, tokenId);
                                    const { data: claimableRewards } = useContractRead(
                                        stakingContract,
                                        "getStakeInfoForToken",
                                        [tokenId, address]
                                    );

                                    const equippedQuantity = ethers.utils.formatUnits(claimableRewards?.[0] || "0", 0);
                                    const claimableCarrot = ethers.utils.formatUnits(claimableRewards?.[1] || "0", 18);

                                    return (
                                        <Flex
                                            key={tokenId}
                                            border="1px solid #e2e8f0"
                                            borderRadius="lg"
                                            p={4}
                                            mb={4}
                                            gap={6}
                                            align="center"
                                            direction="row"
                                            w="100%"
                                        >
                                            {/* 左側：圖片和名稱 */}
                                            <Stack spacing={4} align="center" flexShrink={0}>
                                                <img
                                                    src={nftData?.metadata?.image || ""}
                                                    alt={`${nftData?.metadata?.name || "NFT Image"}`}
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        borderRadius: "8px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <Text fontWeight="bold" textAlign="center" fontSize="sm">
                                                    {nftData?.metadata?.name || "Unknown"}
                                                </Text>
                                            </Stack>

                                            {/* 右側：獎勵和操作 */}
                                            <Stack spacing={4} flex="1">
                                                <Box>
                                                    <Text fontSize="sm">Equipped Quantity: {equippedQuantity}</Text>
                                                    <Text fontSize="sm" color="green.500">
                                                        Token Rewards: {claimableCarrot}
                                                    </Text>
                                                </Box>
                                                <Button
                                                    onClick={() => handleClaimClick(tokenId)}
                                                    bg="blue.500"
                                                    color="white"
                                                    _hover={{ bg: "blue.400" }}
                                                    _active={{ bg: "blue.600" }}
                                                    size="sm"
                                                >
                                                    Claim
                                                </Button>
                                            </Stack>
                                        </Flex>
                                    );
                                })
                            ) : (
                                <Text>No NFTs Found</Text>
                            )}
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Container>
    );
}