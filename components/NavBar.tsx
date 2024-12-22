import { Box, Container, Flex, Heading, Link } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBar() {
    return (
        <Box bg="gray.100" borderBottom="1px solid" borderColor="gray.200" w="100%">
            <Container maxW="1200px" py={4}>
                <Flex direction="row" justifyContent="space-between" alignItems="center">
                    <Heading size="lg">
                        <Link href="/" _hover={{ textDecoration: "none" }}>
                            BaseBot
                        </Link>
                    </Heading>
                    <Flex alignItems="center" justifyContent="flex-end" w="auto">
                        <Link
                            href="/supplier"
                            mr={4}
                            fontSize="lg"
                            _hover={{ textDecoration: "underline", color: "blue.500" }}
                        >
                            Supplier
                        </Link>
                        <ConnectWallet style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} />
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
}