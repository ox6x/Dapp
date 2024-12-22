import React, { useState, useCallback } from "react";

interface NFTQuantityTransactionProps {
  initialQuantity?: number;
  minQuantity?: number;
  onTransaction: (quantity: number) => Promise<void>;
  onTransactionConfirmed?: () => void;
  buttonText?: string | JSX.Element;
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      {/* 數量選擇器 */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          onClick={handleDecrement}
          disabled={isProcessing}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            background: "#e53e3e",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          disabled={isProcessing}
          placeholder="Enter a number" // 提示輸入數字
          style={{
            width: "60px",
            textAlign: "center",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleIncrement}
          disabled={isProcessing}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            background: "#38a169",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          +
        </button>
      </div>
      {/* 按鈕 */}
      <button
        onClick={handleTransaction}
        disabled={isProcessing || quantity === ""}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          background: isProcessing ? "#a0aec0" : "#3182ce",
          color: "#fff",
          border: "none",
          cursor: isProcessing ? "not-allowed" : "pointer",
          fontSize: "16px",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default NFTQuantityTransaction;