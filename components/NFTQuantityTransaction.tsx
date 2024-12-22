import React, { useState, useCallback } from "react";

interface NFTQuantityTransactionProps {
  initialQuantity?: number; 
  minQuantity?: number; 
  onTransaction: (quantity: number) => Promise<void>; 
  onTransactionConfirmed?: () => void; 
  buttonText?: string; 
}

const NFTQuantityTransaction: React.FC<NFTQuantityTransactionProps> = ({
  initialQuantity = 1,
  minQuantity = 1,
  onTransaction,
  onTransactionConfirmed,
  buttonText = "Button",
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (isProcessing) return; 
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

  return (
    <div>
      {/* 第一行: 數量選擇 */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <button onClick={handleDecrement} disabled={isProcessing}>
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          disabled={isProcessing}
          style={{
            width: "40px", // 增加輸入框寬度以更好顯示數字
            textAlign: "center",
          }}
        />
        <button onClick={handleIncrement} disabled={isProcessing}>
          +
        </button>
      </div>
      {/* 第二行: 按鈕 */}
      <div>
        <button
          onClick={handleTransaction}
          disabled={isProcessing}
          style={{
            marginTop: "8px", // 增加按鈕與數量選擇的間距
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default NFTQuantityTransaction;