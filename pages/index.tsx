import {
  ConnectWallet,
  MediaRenderer,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router"; // 用于路由跳转
import {
  FARMER_ADDRESS,
  REWARDS_ADDRESS,
  STAKING_ADDRESS,
  TOOLS_ADDRESS,
} from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Inventory } from "../components/Inventory";
import { Equipped } from "../components/Equipped";
import { BigNumber, ethers } from "ethers";
import {
  Text,
  Box,
  Card,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";

const Home: NextPage = () => {
  const address = useAddress();
  const router = useRouter(); // Next.js 路由对象

  const { contract: farmerContract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(
    farmerContract,
    address
  );
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(
    toolsContract,
    address
  );

  const { data: equippedTools } = useContractRead(stakingContract, "getStakeInfo", [address]);

  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);

  // 如果用户未连接钱包，显示欢迎页
  if (!address) {
    return (
      <Container maxW={"1200px"}>
        <Flex direction={"column"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Heading my={"40px"}>Welcome to Crypto Farm</Heading>
          <ConnectWallet />
        </Flex>
      </Container>
    );
  }

  // 如果数据正在加载，显示 Spinner
  if (loadingOwnedFarmers) {
    return (
      <Container maxW={"1200px"}>
        <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      </Container>
    );
  }

  // 如果用户没有 Farmers，显示领取 Farmer 的页面
  if (ownedFarmers?.length === 0) {
    return (
      <Container maxW={"1200px"}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container maxW={"1200px"}>
      <SimpleGrid columns={2} spacing={10}>
        {/* 农夫信息卡片 */}
        <Card p={5}>
          <Heading>Farmer:</Heading>
          <SimpleGrid columns={2} spacing={10}>
            <Box>
              {ownedFarmers?.map((nft) => (
                <div key={nft.metadata.id}>
                  <MediaRenderer
                    src={nft.metadata.image}
                    height="100%"
                    width="100%"
                  />
                </div>
              ))}
            </Box>
            <Box>
              <Text fontSize={"small"} fontWeight={"bold"}>$CARROT Balance:</Text>
              {rewardBalance && <p>{ethers.utils.formatUnits(rewardBalance, 18)}</p>}
            </Box>
          </SimpleGrid>
        </Card>

        {/* Inventory 卡片，点击跳转到 Store */}
        <Card p={5}>
          <Heading
            cursor="pointer" // 鼠标指针样式
            onClick={() => router.push("/store")} // 点击跳转到 Store 页面
          >
            Inventory:
          </Heading>
          <Skeleton isLoaded={!loadingOwnedTools}>
            <Inventory nft={ownedTools} />
          </Skeleton>
        </Card>
      </SimpleGrid>

      {/* 装备的工具卡片 */}
      <Card p={5} my={10}>
        <Heading mb={"30px"}>Equipped Tools:</Heading>
        <SimpleGrid columns={3} spacing={10}>
          {equippedTools &&
            equippedTools[0].map((nft: BigNumber) => (
              <Equipped key={nft.toNumber()} tokenId={nft.toNumber()} />
            ))}
        </SimpleGrid>
      </Card>
    </Container>
  );
};

export default Home;