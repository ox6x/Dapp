import { useContract, useNFTs } from "@thirdweb-dev/react";
import Link from "next/link";
import { Text, Button, Container, Flex, Heading, SimpleGrid, Spinner } from "@chakra-ui/react";
import NFT from "./NFT";

interface StoreProps {
  contractAddress: string; // 合约地址
  title: string; // 标题
  description: string; // 描述文本
  backLink: string; // 返回按钮的链接
}

const Store: React.FC<StoreProps> = ({ contractAddress, title, description, backLink }) => {
  const { contract } = useContract(contractAddress);
  const { data: nfts, isLoading } = useNFTs(contract);

  return (
    <Container maxW={"1200px"}>
      <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Link href={backLink}>
          <Button>Back</Button>
        </Link>
      </Flex>
      <Heading mt={"40px"}>{title}</Heading>
      <Text>{description}</Text>
      {isLoading ? (
        <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      ) : (
        <SimpleGrid columns={3} spacing={10}>
          {nfts?.map((nftItem) => (
            <NFT key={nftItem.metadata.id} nft={nftItem} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default Store;