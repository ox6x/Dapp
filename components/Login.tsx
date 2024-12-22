import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Container, Flex, Heading } from "@chakra-ui/react";

const Login: React.FC = () => {
  const address = useAddress();

  if (address) return null; // 如果已連結錢包，返回 null（或重定向）。

  return (
    <Container maxW={"container.sm"} px={4}>
      <Flex direction={"column"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <Heading my={6} textAlign="center" fontSize="2xl">
          Welcome to Crypto Farm
        </Heading>
        <ConnectWallet />
      </Flex>
    </Container>
  );
};

export default Login;