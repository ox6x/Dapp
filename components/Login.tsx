import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Flex, Heading, Container } from "@chakra-ui/react";

const Login = () => {
  const address = useAddress();

  return (
    <Container maxW={"1200px"}>
      <Flex direction={"column"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
        {!address ? (
          <>
            <Heading my={"40px"}>Welcome to Crypto Farm</Heading>
            <ConnectWallet />
          </>
        ) : (
          <Heading my={"40px"}>Wallet Connected</Heading>
        )}
      </Flex>
    </Container>
  );
};

// 不使用佈局
Login.getLayout = (page: React.ReactNode) => <>{page}</>;

export default Login;
