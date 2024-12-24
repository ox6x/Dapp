import { Flex, Spinner, Container } from "@chakra-ui/react";
import styles from './LoadingScreen.module.scss';

const LoadingScreen = () => (
  <Container className={styles.loadingScreenContainer}>
    <Flex className={styles.loadingScreenFlex}>
      <Spinner className={styles.loadingSpinner} />
    </Flex>
  </Container>
);

export default LoadingScreen;