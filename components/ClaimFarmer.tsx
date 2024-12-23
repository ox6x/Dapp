import styles from "./ClaimFarmer.module.scss";

export function ClaimFarmer() {
  const { contract } = useContract(FARMER_ADDRESS);
  const { data: metadata } = useContractMetadata(contract);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Claim Your NFT Passport</h1>
        <p>
          Unlock access to exclusive rewards, start mining, and explore the
          crypto ecosystem in a seamless way.
        </p>
      </div>
      <div className={styles.content}>
        <div className={styles.mediaContainer}>
          <MediaRenderer
            src={metadata?.image}
            height="300px"
            width="300px"
            className={styles.media}
          />
        </div>
        <Web3Button
          contractAddress={FARMER_ADDRESS}
          action={(contract) => contract.call("claim")}
          className={styles.claimButton}
        >
          Claim Now
        </Web3Button>
      </div>
    </div>
  );
}