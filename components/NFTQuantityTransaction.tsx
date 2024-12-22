import React, { useState, useCallback, useMemo } from "react";

interface NFTQuantityTransactionProps {
  initialQuantity?: number; 
  minQuantity?: number; 
  onTransaction: (quantity: number) => Promise<void>; 
  onTransactionConfirmed?: () => void; 
  getPrice: (quantity: number) => string; 
  buttonText?: string; 
}

const NFTQuantityTransaction: React.FC<NFTQuantityTransactionProps> = ({
  initialQuantity = 1,
  minQuantity = 1,
  onTransaction,
  onTransactionConfirmed,
  getPrice,
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

  const price = useMemo(() => getPrice(quantity), [getPrice, quantity]);

  return (
    <div>
      {/* 這裡用 inline-flex or flex + gap 讓 -、數量、+ 在同一行 */}
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
          style={{ width: "4px", textAlign: "center" }} // 視需求調整
        />
        <button onClick={handleIncrement} disabled={isProcessing}>
          +
        </button>
      </div>
      <div style={{ marginBottom: "8px" }}>Price: {price}</div>
      <button onClick={handleTransaction} disabled={isProcessing}>
        {buttonText}
      </button>
    </div>
  );
};

export default NFTQuantityTransaction;