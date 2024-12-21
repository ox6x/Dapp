import React, { useState, useCallback, useMemo } from "react";

interface NFTQuantityTransactionProps {
  initialQuantity?: number; // 初始数量
  minQuantity?: number; // 最小数量
  onTransaction: (quantity: number) => Promise<void>; // 交易回调函数
  onTransactionConfirmed?: () => void; // 交易成功后的回调
  getPrice: (quantity: number) => string; // 价格计算函数
  buttonText?: string; // 按钮文本
}

const NFTQuantityTransaction: React.FC<NFTQuantityTransactionProps> = ({
  initialQuantity = 1,
  minQuantity = 1,
  onTransaction,
  onTransactionConfirmed,
  getPrice,
  buttonText = "Button", // 默认按钮文本
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isProcessing, setIsProcessing] = useState(false); // 防止重复提交

  // 使用 useCallback 优化函数定义
  const handleIncrement = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  const handleDecrement = useCallback(() => {
    setQuantity((prev) => Math.max(minQuantity, prev - 1));
  }, [minQuantity]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setQuantity(value > 0 ? value : minQuantity);
    },
    [minQuantity]
  );

  const handleTransaction = useCallback(async () => {
    if (isProcessing) return; // 避免重复提交
    setIsProcessing(true);
    try {
      await onTransaction(quantity);
      onTransactionConfirmed?.();
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, onTransaction, onTransactionConfirmed, quantity]);

  // 使用 useMemo 优化价格计算
  const price = useMemo(() => getPrice(quantity), [getPrice, quantity]);

  return (
    <div>
      <div>
        <button onClick={handleDecrement} disabled={isProcessing}>
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          disabled={isProcessing}
        />
        <button onClick={handleIncrement} disabled={isProcessing}>
          +
        </button>
      </div>
      <div>Price: {price}</div>
      <button onClick={handleTransaction} disabled={isProcessing}>
        {buttonText}
      </button>
    </div>
  );
};

export default NFTQuantityTransaction;