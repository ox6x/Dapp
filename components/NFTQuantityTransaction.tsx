import React, { useState, useCallback } from "react";

interface NFTQuantityTransactionProps {
  initialQuantity?: number;
  minQuantity?: number;
  onTransaction: (quantity: number) => Promise<void>;
  onTransactionConfirmed?: () => void;
  buttonText?: string | JSX.Element;
}

const NFTQuantityTransaction: React.FC<NFTQuantityTransactionProps> = ({
  initialQuantity,
  minQuantity = 1,
  onTransaction,
  onTransactionConfirmed,
  buttonText = "Button",
}) => {
  const [quantity, setQuantity] = useState<number | "">("");
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
    if (isProcessing || typeof quantity !== "number") return;
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
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "4px 8px",
          width: "120px",
        }}
      >
        <button
          onClick={handleDecrement}
          disabled={isProcessing}
          style={{
            background: "none",
            border: "none",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontSize: "18px",
            color: isProcessing ? "#a0aec0" : "#3182ce",
          }}
        >
          &lt;
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          disabled={isProcessing}
          placeholder="0"
          style={{
            textAlign: "center",
            border: "none",
            width: "24px", // 改為 24px
            outline: "none",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleIncrement}
          disabled={isProcessing}
          style={{
            background: "none",
            border: "none",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontSize: "18px",
            color: isProcessing ? "#a0aec0" : "#3182ce",
          }}
        >
          &gt;
        </button>
      </div>
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