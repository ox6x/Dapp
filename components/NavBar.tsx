import { Container, Flex, Heading, Link } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBar() {
    return (
        <Container maxW={"1200px"} py={4}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Heading>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        BaseBot
                    </Link>
                </Heading>
                <Flex alignItems={"center"} justifyContent={"flex-end"} w="auto">
                    <Link href="/store" style={{ marginRight: "1rem", fontSize: "1rem", textDecoration: "none" }}>
                        Store
                    </Link>
                    <ConnectWallet style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} />
                </Flex>
            </Flex>
        </Container>
    );
}