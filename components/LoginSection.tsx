import { ConnectWallet } from "@thirdweb-dev/react";
import { Container, Flex, Heading } from "@chakra-ui/react";

const LoginSection = () => {
  return (
    <Container maxW={"container.sm"} px={4}>
      <Flex direction={"column"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <Heading my={6} textAlign="center" fontSize="2xl">
          Join Crypto Farm and easily start your Web3 mining journey!
        </Heading>
        <ConnectWallet />
      </Flex>
    </Container>
  );
};

export default LoginSection;