import { Container, Flex, Heading, Link } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function NavBar() {
    const address = useAddress(); // 获取钱包地址

    // 如果未连接钱包，不渲染 NavBar
    if (!address) {
        return null;
    }

    return (
        <Container maxW={"1200px"} py={4}>
            <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Heading>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        BaseBot
                    </Link>
                </Heading>
                <Flex alignItems={"center"} justifyContent={"flex-end"} w="auto">
                    <Link href="/supplier" style={{ marginRight: "1rem", fontSize: "1rem", textDecoration: "none" }}>
                        Resource
                    </Link>
                    <ConnectWallet style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} />
                </Flex>
            </Flex>
        </Container>
    );
}