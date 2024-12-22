import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import {
  Flex,
  Heading,
  Container,
  Box,
  Text,
  Button,
  useColorModeValue
} from "@chakra-ui/react";

const Login = () => {
  const address = useAddress();

  // 可以先定義一些色彩或樣式變數，方便後續引用
  const bgGradient = useColorModeValue(
    "linear(to-b, teal.100, white)",
    "linear(to-b, gray.700, gray.900)"
  );
  const headingColor = useColorModeValue("teal.700", "teal.200");

  return (
    <Box
      // 全頁面背景設計
      minH="100vh"
      bgGradient={bgGradient}
      textAlign="center"
    >
      <Container maxW="1200px" py={10}>
        <Flex
          direction="column"
          h="calc(100vh - 80px)" // 預留上下Padding位置
          justifyContent="center"
          alignItems="center"
        >
          {!address ? (
            <>
              <Heading
                my={6}
                color={headingColor}
                fontSize={{ base: "3xl", md: "5xl" }}
              >
                Welcome to Crypto Farm
              </Heading>
              <Text fontSize="lg" mb={10}>
                Connect your wallet to start your journey.
              </Text>
              <ConnectWallet />
            </>
          ) : (
            <>
              <Heading my={6} color={headingColor} fontSize="4xl">
                Wallet Connected
              </Heading>
              <Text fontSize="lg" mb={10}>
                You are ready to explore the platform!
              </Text>
              {/* 這裡你可以放置任何登入後的延伸功能按鈕或連結 */}
              <Button colorScheme="teal">Go to Dashboard</Button>
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

// 不使用佈局
Login.getLayout = (page: React.ReactNode) => <>{page}</>;

export default Login;