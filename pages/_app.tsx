/** @jsxImportSource @emotion/react */
import type { AppProps } from "next/app";
import { ThirdwebProvider, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Login from "../components/Login";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;
const PASSPORT_CONTRACT_ADDRESS = "0xYourPassportContractAddress"; // 替换为您的通行证合约地址

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const address = useAddress();
  const router = useRouter();

  // 引入通行证合约
  const { contract } = useContract(PASSPORT_CONTRACT_ADDRESS);

  // 检查用户是否持有通行证
  const { data: hasPassport, isLoading } = useContractRead(contract, "balanceOf", [
    address,
    0, // 通行证的 Token ID
  ]);

  useEffect(() => {
    if (address && hasPassport && hasPassport.gt(0)) {
      // 如果用户持有通行证，跳转到 Home 页面
      router.push("/home");
    } else if (address && !isLoading && (!hasPassport || hasPassport.eq(0))) {
      // 如果用户没有通行证，跳转到 ClaimFarmer 页面
      router.push("/claim-farmer");
    }
  }, [address, hasPassport, isLoading, router]);

  // 如果用户未连接钱包，显示 Login 组件
  if (!address) {
    return (
      <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Login />
      </Box>
    );
  }

  // 如果正在检查通行证状态，显示加载状态
  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <p>Loading...</p>
      </Box>
    );
  }

  // 如果用户已连接钱包且状态已确定，渲染实际页面内容
  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={CLIENT_ID}
      activeChain={{
        chainId: 97,
        rpc: ["https://97.rpc.thirdweb.com"],
        nativeCurrency: {
          name: "Binance Smart Chain Testnet",
          symbol: "tBNB",
          decimals: 18,
        },
        name: "BSC Testnet",
        chain: "bsc-testnet",
        shortName: "tBNB",
        testnet: true,
        slug: "bsc-testnet",
      }}
    >
      <ChakraProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <AuthWrapper>
          <NavBar />
          <Box minH="100vh" p={4}>
            <Component {...pageProps} />
          </Box>
        </AuthWrapper>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;