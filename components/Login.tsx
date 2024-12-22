import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Flex, Heading, Container, Box, Button, Text } from "@chakra-ui/react";

const Login = () => {
  const address = useAddress();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bgGradient="linear(to-br, #F3F4F6, #FFFFFF)"
      fontFamily="'Inter', sans-serif"
    >
      {/* Logo Section */}
      <Box mb="6">
        <img
          src="https://via.placeholder.com/150" // Replace with the Coinbase logo URL
          alt="Coinbase Logo"
          style={{ width: "150px" }}
        />
      </Box>

      {/* Login Section */}
      <Container
        maxW="400px"
        bg="white"
        p="8"
        borderRadius="12px"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        textAlign="center"
      >
        {!address ? (
          <>
            <Heading size="lg" mb="4" color="#333">
              Welcome to Crypto Farm
            </Heading>
            <ConnectWallet />
          </>
        ) : (
          <>
            <Heading size="lg" mb="4" color="#333">
              Wallet Connected
            </Heading>
            <Text mb="4" color="gray.600">
              Address: {address}
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => console.log("Proceed to Dashboard")}
            >
              Go to Dashboard
            </Button>
          </>
        )}
      </Container>
    </Flex>
  );
};

// Disable layout usage
Login.getLayout = (page: React.ReactNode) => <>{page}</>;

export default Login;