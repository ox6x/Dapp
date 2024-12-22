import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Container, Flex, Heading } from "@chakra-ui/react";

export const Login = () => {
  const address = useAddress();

  if (!address) {
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
  }

  return null; // 若需要返回其他內容，可進一步修改
};