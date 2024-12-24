import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

const LoginSection = () => {
  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-b, white, gray.100)" /* Binance 漸層背景 */
      padding="4"
    >
      <Container
        maxW="sm"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        border="2px solid"
        borderColor="yellow.400" /* Binance 黃 */
        padding="6"
        textAlign="center"
      >
        {/* 主標題 */}
        <Heading as="h1" size="lg" color="blue.600" mb="4">
          Welcome to Binance Dapp
        </Heading>

        {/* 描述文字 */}
        <Text fontSize="md" color="gray.600" mb="6">
          Log in to manage your assets, explore the marketplace, and unlock new
          opportunities.
        </Text>

        {/* 登錄表單 */}
        <VStack spacing="4">
          <Input
            placeholder="Enter your wallet address"
            variant="outline"
            focusBorderColor="yellow.400" /* 焦點黃色 */
            size="lg"
          />
          <Button
            colorScheme="yellow"
            size="lg"
            width="full"
            _hover={{
              bg: 'yellow.500', /* 深黃 */
              transform: 'scale(1.05)', /* 輕微放大 */
              boxShadow: 'md',
            }}
          >
            Log In
          </Button>
        </VStack>
      </Container>
    </Flex>
  );
};

export default LoginSection;