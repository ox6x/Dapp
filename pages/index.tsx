import { useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Inventory } from "../components/Inventory";
import { Equipped } from "../components/Equipped";
import { Farmer } from "../components/Farmer";
import { Login } from "../components/Login";
import { Container, Box, Card, Heading, Skeleton, Spinner, Flex } from "@chakra-ui/react";
import { BigNumber } from "ethers";

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
    return <Login />;
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
      <Farmer ownedFarmers={ownedFarmers} rewardBalance={rewardBalance} />
      <Box mb={6}>
        <Card p={4}>
          <Heading fontSize="lg" mb={4}>
            Inventory
          </Heading>
          <Skeleton isLoaded={!loadingOwnedTools}>
            <Inventory
              nft={ownedTools}
            />
          </Skeleton>
        </Card>
      </Box>
      <Box>
        <Card p={4}>
          <Heading fontSize="lg" mb={4}>
            Equipped
          </Heading>
          {equippedTools &&
            equippedTools[0].map((nft: BigNumber) => (
              <Equipped
                key={nft.toNumber()}
                tokenId={nft.toNumber()}
              />
            ))}
        </Card>
      </Box>
    </Container>
  );
};

export default Home;