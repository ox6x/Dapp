import { MediaRenderer, Web3Button, useContract, useContractMetadata } from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import styles from "./ClaimFarmer.module.scss"; // 引入 SCSS

export function ClaimFarmer() {
    const { contract } = useContract(FARMER_ADDRESS);
    const { data: metadata } = useContractMetadata(contract);

    return (
        <div className={styles.container}>
            <div className={styles.flex}>
                <h1 className={styles.heading}>
                    Claim your exclusive NFT Passport to start mining, earning rewards, and exploring the Crypto Farm ecosystem.
                </h1>
                <div className={styles.box}>
                    <MediaRenderer
                        src={metadata?.image}
                        height="300px"
                        width="300px"
                    />
                </div>
                <Web3Button
                    className={styles.web3Button}
                    contractAddress={FARMER_ADDRESS}
                    action={(contract) => contract.erc1155.claim(0, 1)}
                >
                    Claim Your NFT Passport
                </Web3Button>
            </div>
        </div>
    );
}