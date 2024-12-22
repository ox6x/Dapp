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
              theme="dark"
              modalConfig={{
                style: {
                  width: "80vw", // 动态调整宽度
                  maxWidth: "500px", // 最大宽度
                  height: "70vh", // 动态调整高度
                  maxHeight: "90vh", // 最大高度
                  margin: "auto", // 居中对齐
                  overflow: "auto", // 内容溢出时滚动
                },
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