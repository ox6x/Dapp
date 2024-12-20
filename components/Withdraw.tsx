import { useState } from "react";
import { prepareContractCall } from "@thirdweb-dev/sdk";
import { useSendTransaction, useContract } from "@thirdweb-dev/react";
import { STAKING_ADDRESS } from "../const/addresses";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";

export default function WithdrawRewards() {
  const { contract: stakingContract } = useContract(STAKING_ADDRESS); // 获取合约实例
  const { mutate: sendTransaction, isLoading } = useSendTransaction(); // 发送交易 Hook

  const [amount, setAmount] = useState<number | string>(""); // 用户输入的数量状态

  const handleWithdraw = async () => {
    if (!stakingContract) {
      alert("Contract not loaded!");
      return;
    }

    // 准备交易调用
    const transaction = await prepareContractCall({
      contract: stakingContract,
      method: "withdrawRewardTokens", // 合约方法
      params: [amount], // 输入参数
    });

    // 发送交易
    sendTransaction(transaction, {
      onSuccess: () => alert("Transaction successful!"),
      onError: (err) => alert(`Transaction failed: ${err.message}`),
    });
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="md">
      <Stack spacing={3}>
        <Text fontSize="lg" fontWeight="bold">
          Withdraw Reward Tokens
        </Text>
        {/* 输入框 */}
        <Input
          placeholder="Enter amount to withdraw"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {/* 按钮 */}
        <Button
          colorScheme="blue"
          onClick={handleWithdraw}
          isLoading={isLoading} // 显示加载状态
          isDisabled={!amount || parseFloat(amount) <= 0} // 禁用无效输入
        >
          Withdraw
        </Button>
      </Stack>
    </Box>
  );
}
