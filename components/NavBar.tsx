import {
  Container,
  Flex,
  Heading,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Text,
  Stack,
  Box,
} from "@chakra-ui/react";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useNFT,
  useContractRead,
} from "@thirdweb-dev/react";
import { FaWallet } from "react-icons/fa";
import styles from './NavBar.module.scss';

// 多個合約地址
const contracts: Record<"V1" | "V2", string> = {
  V1: "0x605f710b66Cc10A0bc0DE7BD8fe786D5C9719179", // V1 工具合約地址
  V2: "0xf747821D7A019B0C8c11824a141D2EA6De89cA34", // V2 工具合約地址
};

// 代幣合約地址
const tokens: Record<"TOKEN1" | "TOKEN2", string> = {
  TOKEN1: "0x1234567890abcdef1234567890abcdef12345678", // 第一個代幣合約地址
  TOKEN2: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", // 第二個代幣合約地址
};

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
          BaseBot
        </Heading>
        <Flex alignItems={"center"} justifyContent={"flex-end"} w="auto">
          <IconButton
            icon={<FaWallet />}
            aria-label="Open Wallet"
            onClick={onOpen}
            className={styles.walletIconButton}
            variant="ghost"
          />
        </Flex>
      </Flex>

      {/* Drawer for NFTs and Tokens */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody display="flex" flexDirection="column" alignItems="flex-start" justifyContent="flex-start" pt={6}>
            {/* NFTs Section */}
            <Heading as="h2" size="lg" mb={6}>
              Your NFTs
            </Heading>

            {Object.keys(contracts).map((version) => {
              const versionKey = version as keyof typeof contracts; // 明確鍵的類型
              const { contract: toolContract } = useContract(contracts[versionKey]);

              return (
                <Box key={versionKey} w="100%" mb={6}>
                  <Heading size="md" mb={4}>
                    Version {versionKey}
                  </Heading>
                  <Stack spacing={4}>
                    {[1, 2, 3].map((tokenId) => {
                      const { data: nftData } = useNFT(toolContract, tokenId);

                      return (
                        <Flex
                          key={`${versionKey}-${tokenId}`}
                          direction="row"
                          border="1px solid #e2e8f0"
                          borderRadius="lg"
                          p={4}
                          align="center"
                          gap={6}
                        >
                          {/* NFT Image */}
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

                          {/* NFT Info */}
                          <Stack>
                            <Text fontWeight="bold">
                              {nftData?.metadata?.name || "Unknown NFT"}
                            </Text>
                            <Text>Token ID: {tokenId}</Text>
                          </Stack>
                        </Flex>
                      );
                    })}
                  </Stack>
                </Box>
              );
            })}

            {/* Tokens Section */}
            <Heading as="h2" size="lg" mb={6}>
              Your Tokens
            </Heading>
            {Object.keys(tokens).map((token) => {
              const tokenKey = token as keyof typeof tokens; // 明確鍵的類型
              const { contract: tokenContract } = useContract(tokens[tokenKey]);
              const { data: tokenBalance } = useContractRead(
                tokenContract,
                "balanceOf",
                [address]
              );

              return (
                <Box key={tokenKey} w="100%" mb={4}>
                  <Flex
                    direction="row"
                    border="1px solid #e2e8f0"
                    borderRadius="lg"
                    p={4}
                    align="center"
                    justify="space-between"
                  >
                    <Text fontWeight="bold">{tokenKey}</Text>
                    <Text>
                      Balance:{" "}
                      {tokenBalance
                        ? parseFloat(tokenBalance.toString()).toFixed(2)
                        : "Loading..."}
                    </Text>
                  </Flex>
                </Box>
              );
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
}