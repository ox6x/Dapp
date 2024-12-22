import { ConnectWallet, MediaRenderer, useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next"; // 确保引入了 NextPage 类型
import { FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import InventoryCard from "../components/InventoryCard";
import EquippedCard from "../components/EquippedCard";
import { BigNumber, ethers } from "ethers";
import { Text, Box, Card, Container, Flex, Heading, Spinner, Skeleton } from "@chakra-ui/react";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: farmercontract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmercontract, address);
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);

  const { data: equippedTools } = useContractRead(
    stakingContract,
    "getStakeInfo",
    [address]
  );

  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);

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

  if (loadingOwnedFarmers) {
    return (
      <Container maxW={"container.sm"} px={4}>
        <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner size="lg" />
        </Flex>
      </Container>
    );
  }

  if (ownedFarmers?.length === 0) {
    return (
      <Container maxW={"container.sm"} px={4}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container maxW={"container.sm"} px={4} py={6}>
      <Box mb={6}>
        <Card p={4}>
          <Heading fontSize="lg" mb={4}>
            Farmer
          </Heading>
          {ownedFarmers?.map((nft) => (
            <Box key={nft.metadata.id} borderWidth="1px" borderRadius="lg" overflow="hidden" mb={4}>
              <MediaRenderer src={nft.metadata.image} height="150px" width="100%" />
            </Box>
          ))}
          <Text fontSize={"sm"} fontWeight={"bold"} mb={2}>
            $CARROT Balance:
          </Text>
          {rewardBalance && (
            <Text fontSize={"sm"}>{ethers.utils.formatUnits(rewardBalance, 18)}</Text>
          )}
        </Card>
      </Box>

      {/* 使用 InventoryCard */}
      <InventoryCard ownedTools={ownedTools} loadingOwnedTools={loadingOwnedTools} />

      {/* 使用 EquippedCard */}
      <EquippedCard equippedTools={equippedTools} />
    </Container>
  );
};

export default Home;