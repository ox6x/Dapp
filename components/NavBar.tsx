import { Container, Flex, Heading } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBar() {
    return (
        <Container maxW={"1200px"} py={4}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Heading>Crypto Farm</Heading>
                <Flex alignItems={"center"} justifyContent={"flex-end"} w="auto">
                    <ConnectWallet style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} />
                </Flex>
            </Flex>
        </Container>
    );
}