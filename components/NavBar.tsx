import { useState } from "react";
import {
  Container,
  Flex,
  Heading,
  Link,
  Button,
  Box,
  Collapse,
} from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "./NavBar.module.scss";

export default function NavBar() {
  const address = useAddress();
  const [isPanelOpen, setPanelOpen] = useState(false);

  if (!address) {
    return null;
  }

  const togglePanel = () => setPanelOpen(!isPanelOpen);

  return (
    <Container className={styles.navBarContainer}>
      <Flex className={styles.navBarFlex}>
        <Heading className={styles.heading}>
          <Link href="/" style={{ textDecoration: "none" }}>
            BaseBot
          </Link>
        </Heading>
        <Flex alignItems="center" justifyContent="flex-end" w="auto">
          <Link href="/supplier" className={styles.link}>
            Supplier
          </Link>
          <Button onClick={togglePanel} size="sm" ml={4} colorScheme="blue">
            {isPanelOpen ? "Close Wallet Panel" : "Wallet Panel"}
          </Button>
        </Flex>
      </Flex>

      {/* 折疊式 Wallet Panel */}
      <Collapse in={isPanelOpen} animateOpacity>
        <Box
          mt={4}
          p={4}
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