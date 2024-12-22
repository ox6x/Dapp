import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import {
  Flex,
  Heading,
  Container,
  Box,
  Text,
  Button,
  Image,
  useColorModeValue
} from "@chakra-ui/react";

const Login = () => {
  const address = useAddress();

  // Binance 相關色彩（可依據專案實際需求做調整）
  // 這裡示範了黑底 + 黃金色調
  const binanceGold = "#F0B90B"; // 幣安標誌常見金色
  const binanceDark = "#121212"; // 幣安黑底

  // 也可以透過 useColorModeValue 做主題切換
  // 這裡示範直接使用固定色彩以營造 Binance 的強烈印象
  const bgColor = binanceDark;
  const textColor = binanceGold;
  const headingColor = "#FFFFFF"; // 白色標題文字

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="1200px" py={10}>
        <Flex
          direction="column"
          h="calc(100vh - 80px)"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          {/* 加入 Binance 相關的 Logo 或背景圖以營造品牌感 */}
          <Box mb={10}>
            <Image
              src="/binance-logo.svg"
              alt="Binance Logo"
              boxSize="80px"
              mx="auto"
            />
          </Box>

          {!address ? (
            <>
              <Heading
                my={4}
                fontSize={{ base: "3xl", md: "5xl" }}
                color={headingColor}
              >
                Welcome to Crypto Farm
              </Heading>
              <Text fontSize="lg" color={textColor} mb={10}>
                Connect your wallet to start your journey in the Binance world.
              </Text>
              <ConnectWallet accentColor={binanceGold} />
            </>
          ) : (
            <>
              <Heading my={4} fontSize="4xl" color={headingColor}>
                Wallet Connected
              </Heading>
              <Text fontSize="lg" color={textColor} mb={10}>
                You are ready to explore the Binance ecosystem!
              </Text>
              <Button
                bg={binanceGold}
                color={binanceDark}
                _hover={{ opacity: 0.8 }}
              >
                Go to Dashboard
              </Button>
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