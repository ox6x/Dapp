import { MediaRenderer, Web3Button, useContract, useContractMetadata } from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";

export function ClaimPassport() {
    const { contract } = useContract(FARMER_ADDRESS);
    const { data: metadata } = useContractMetadata(contract);
    
    return (
        <Container maxW={"1200px"}>
            <Flex direction={"column"} alignItems={"center"} justifyContent={"center"} h={"50vh"}>
                <Heading textAlign={"center"}>Unlock Your Web3 Mining Adventure</Heading>
                <Text fontSize={"lg"} color={"gray.600"} mt={4} textAlign={"center"}>
                    Claim your exclusive NFT Passport to start mining, earning rewards, and exploring the Crypto Farm ecosystem.
                </Text>
                <Box borderRadius={"8px"} overflow={"hidden"} my={10} boxShadow={"md"}>
                    <MediaRenderer
                        src={metadata?.image}
                        height="300px"
                        width="300px"
                    />
                </Box>
                
                <Web3Button
                    contractAddress={FARMER_ADDRESS}
                    action={(contract) => contract.erc1155.claim(0, 1)}
                    colorScheme={"teal"}
                    size={"lg"}
                >
                    Claim Your NFT Passport
                </Web3Button>
            </Flex>
        </Container>
    );
}