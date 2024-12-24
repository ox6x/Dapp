import { Flex, Spinner, Container } from "@chakra-ui/react";

const LoadingScreen = () => (
  <Container maxW={"container.sm"} px={4}>
    <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"}>
      <Spinner size="lg" />
    </Flex>
  </Container>
);

export default LoadingScreen;
