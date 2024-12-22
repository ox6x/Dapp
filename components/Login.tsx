import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Flex, Heading, Container } from "@chakra-ui/react";

const Login = ({ children }: { children: React.ReactNode }) => {
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

  return <>{children}</>;
};

Login.getLayout = (page: React.ReactNode) => <>{page}</>;

export default Login;