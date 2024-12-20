import {
  ConnectWallet,
  MediaRenderer,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
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
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";

const Home: NextPage = () => {
  const address = useAddress();
  const router = useRouter();

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
      <Flex direction="column" h="100vh" justifyContent="center" alignItems="center">
        <Heading mb={6}>Welcome to Crypto Farm</Heading>
        <ConnectWallet />
      </Flex>
    );
  }

  // 如果数据正在加载，显示 Spinner
  if (loadingOwnedFarmers) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    );
  }

  // 如果用户没有 Farmers，显示领取 Farmer 的页面
  if (ownedFarmers?.length === 0) {
    return <ClaimFarmer />;
  }

  return (
    <Box px={4} py={6}>
      <SimpleGrid columns={2} spacing={10}>
        {/* 农夫信息 */}
        <Box>
          <Heading mb={4}>Farmer:</Heading>
          <SimpleGrid columns={2} spacing={6}>
            <Box>
              {ownedFarmers?.map((nft) => (
                <MediaRenderer
                  key={nft.metadata.id}
                  src={nft.metadata.image}
                  height="100%"
                  width="100%"
                />
              ))}
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold">$CARROT Balance:</Text>
              {rewardBalance && <Text>{ethers.utils.formatUnits(rewardBalance, 18)}</Text>}
            </Box>
          </SimpleGrid>
        </Box>

        {/* Inventory，点击跳转到 Store */}
        <Box>
          <Heading
            mb={4}
            cursor="pointer"
            onClick={() => router.push("/store")}
          >
            Inventory:
          </Heading>
          <Skeleton isLoaded={!loadingOwnedTools}>
            <Inventory nft={ownedTools} />
          </Skeleton>
        </Box>
      </SimpleGrid>

      {/* 装备的工具 */}
      <Box mt={10}>
        <Heading mb={6}>Equipped Tools:</Heading>
        <SimpleGrid columns={3} spacing={6}>
          {equippedTools &&
            equippedTools[0].map((nft: BigNumber) => (
              <Equipped key={nft.toNumber()} tokenId={nft.toNumber()} />
            ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Home;