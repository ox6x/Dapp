import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Flex, Heading, Container, Button, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure } from "@chakra-ui/react";

const Login = () => {
  const address = useAddress();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW={"1200px"}>
      <Flex direction={"column"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
        {!address ? (
          <>
            <Heading my={"40px"}>Welcome to Crypto Farm</Heading>
            <Button onClick={onOpen}>Connect Wallet</Button>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent maxW="80vw" maxH="90vh" overflow="auto">
                <ModalBody>
                  <ConnectWallet theme="dark" />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <Heading my={"40px"}>Wallet Connected</Heading>
        )}
      </Flex>
    </Container>
  );
};

// 不使用布局
Login.getLayout = (page: React.ReactNode) => <>{page}</>;

export default Login;