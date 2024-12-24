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
  Text,
  Box,
  Stack,
  Button,
} from "@chakra-ui/react";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useContractRead,
  useNFT,
} from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import styles from './NavBar.module.scss';

const TOOLS_ADDRESS = "0xYourToolsContractAddress"; // 替換為實際的合約地址

export default function NavBar() {
  const address = useAddress();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // NFT 工具合約
  const { contract: toolContract } = useContract(TOOLS_ADDRESS);

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

      {/* Drawer for NFT and Wallet */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" pt={10}>
            <Heading as="h2" size="lg" mb={4}>
              Your NFTs
            </Heading>

            {/* 顯示 NFT */}
            {address ? (
              <Stack spacing={6} w="100%">
                {/* 使用 tokenId 1 作為示例，可以根據需求循環顯示多個 */}
                {[1, 2, 3].map((tokenId) => {
                  const { data: nftData } = useNFT(toolContract, tokenId);

                  return (
                    <Flex
                      key={tokenId}
                      direction="row"
                      border="1px solid #e2e8f0"
                      borderRadius="lg"
                      p={4}
                      align="center"
                      gap={6}
                    >
                      {/* NFT 圖片 */}
                      <MediaRenderer
                        src={nftData?.metadata?.image || ""}
                        alt={nftData?.metadata?.name || "NFT Image"}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />

                      {/* NFT 資訊 */}
                      <Stack>
                        <Text fontWeight="bold">{nftData?.metadata?.name || "Unknown NFT"}</Text>
                        <Text>Token ID: {tokenId}</Text>
                      </Stack>
                    </Flex>
                  );
                })}
              </Stack>
            ) : (
              <Text>Please connect your wallet to view NFTs.</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
}