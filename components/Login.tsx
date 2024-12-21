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
            <ConnectWallet
              style={{
                fontSize: "1rem", // 自适应字体大小
                padding: "0.5rem 1rem", // 按钮大小
              }}
              modalSize={{
                base: "100%", // 小屏幕自适应宽度
                sm: "400px", // 中屏幕大小
                md: "500px", // 大屏幕大小
              }}
            />
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