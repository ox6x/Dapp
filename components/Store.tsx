import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import { Text, Button, Container, Flex, Heading, SimpleGrid, Spinner } from "@chakra-ui/react";
import NFT from "../components/NFT";

// 定义 NFT 数据类型（根据 thirdweb 提供的类型）
interface NFTData {
  metadata: {
    id: string;
    [key: string]: any; // 可根据实际 metadata 结构调整
  };
  [key: string]: any; // 如果有额外数据，也可以添加
}

const Store: React.FC = () => {
  const { contract } = useContract(TOOLS_ADDRESS);
  const { data: nfts, isLoading } = useNFTs(contract);

  return (
    <Container maxW={"1200px"}>
      <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Link href="/">
          <Button>Back</Button>
        </Link>
      </Flex>
      <Heading mt={"40px"}>Store</Heading>
      <Text>Purchase tools with $CARROTS to increase your earnings.</Text>
      {isLoading ? (
        <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      ) : (
        <SimpleGrid columns={3} spacing={10}>
          {nfts?.map((nftItem: NFTData) => (
            <NFT key={nftItem.metadata.id} nft={nftItem} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default Store;