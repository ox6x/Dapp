import { Container, Flex, Heading, Link } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBar() {
    return (
        <Container maxW={"1200px"} py={4}>
            <Flex direction={"row"} justifyContent={"space-between"}>
                <Heading>Crypto Farm</Heading>
                <Flex alignItems={"center"}>
                </Flex>
                <ConnectWallet/>
            </Flex>
        </Container>
    )
};