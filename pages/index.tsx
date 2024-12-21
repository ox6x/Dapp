import { ConnectWallet, MediaRenderer, useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Inventory } from "../components/Inventory";
import { Equipped } from "../components/Equipped";
import { BigNumber, ethers } from "ethers";
import { Text, Box, Card, Container, Flex, Heading, SimpleGrid, Spinner, Skeleton } from "@chakra-ui/react";

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
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              {ownedFarmers?.map((nft) => (
                <Box key={nft.metadata.id} borderWidth="1px" borderRadius="lg" overflow="hidden" mb={4}>
                  <MediaRenderer 
                    src={nft.metadata.image} 
                    height="150px"
                    width="100%"
                  />
                </Box>
              ))}
            </Box>
            <Box>
              <Text fontSize={"sm"} fontWeight={"bold"} mb={2}>
                $CARROT Balance:
              </Text>
              {rewardBalance && (
                <Text fontSize={"sm"}>{ethers.utils.formatUnits(rewardBalance, 18)}</Text>
              )}
            </Box>
          </SimpleGrid>
        </Card>
      </Box>
      
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
            Equipped Tools
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
            {equippedTools &&
              equippedTools[0].map((nft: BigNumber) => (
                <Equipped
                  key={nft.toNumber()}
                  tokenId={nft.toNumber()}
                />
              ))}
          </SimpleGrid>
        </Card>
      </Box>
    </Container>
  );
};

export default Home;