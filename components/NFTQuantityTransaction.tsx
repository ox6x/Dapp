import React, { useState, useCallback } from "react";

interface NFTQuantityTransactionProps {
  initialQuantity?: number;
  minQuantity?: number;
  onTransaction: (quantity: number) => Promise<void>;
  onTransactionConfirmed?: () => void;
  buttonText?: string;
}

const NFTQuantityTransaction: React.FC<NFTQuantityTransactionProps> = ({
  initialQuantity, // 初始數量為可選，預設不設定值
  minQuantity = 1,
  onTransaction,
  onTransactionConfirmed,
  buttonText = "Button",
}) => {
  const [quantity, setQuantity] = useState<number | "">(""); // 初始值為空字串
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIncrement = useCallback(() => {
    setQuantity((prev) =>
      typeof prev === "number" ? prev + 1 : minQuantity
    );
  }, [minQuantity]);

  const handleDecrement = useCallback(() => {
    setQuantity((prev) =>
      typeof prev === "number" ? Math.max(minQuantity, prev - 1) : minQuantity
    );
  }, [minQuantity]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        setQuantity("");
      } else {
        const numberValue = parseInt(value, 10);
        setQuantity(isNaN(numberValue) ? "" : Math.max(minQuantity, numberValue));
      }
    },
    [minQuantity]
  );

  const handleTransaction = useCallback(async () => {
    if (isProcessing || typeof quantity !== "number") return; // 確保數量有效
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // 水平置中
        justifyContent: "center", // 垂直置中
        height: "100vh", // 全屏高度以便垂直居中
        gap: "16px",
      }}
    >
      {/* 數量選擇器 */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
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
          placeholder="Enter a number" // 提示輸入數字
          style={{ width: "40px", textAlign: "center" }}
        />
        <button onClick={handleIncrement} disabled={isProcessing}>
          +
        </button>
      </div>
      {/* 按鈕 */}
      <button onClick={handleTransaction} disabled={isProcessing || quantity === ""}>
        {buttonText}
      </button>
    </div>
  );
};

export default NFTQuantityTransaction;