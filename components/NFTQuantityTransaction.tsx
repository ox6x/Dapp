import React, { useState, useCallback, useMemo } from "react";
import "./NFTQuantityTransaction.css";

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
  if (minQuantity < 1) throw new Error("minQuantity must be at least 1");
  if (initialQuantity < minQuantity)
    throw new Error("initialQuantity cannot be less than minQuantity");

  const [quantity, setQuantity] = useState(initialQuantity);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIncrement = useCallback(() => setQuantity(q => q + 1), []);
  const handleDecrement = useCallback(
    () => setQuantity(q => Math.max(minQuantity, q - 1)),
    [minQuantity]
  );
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setQuantity(!isNaN(value) && value >= minQuantity ? value : minQuantity);
    },
    [minQuantity]
  );

  const handleTransaction = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onTransaction(quantity);
      setQuantity(initialQuantity);
      if (onTransactionConfirmed) onTransactionConfirmed();
    } finally {
      setIsProcessing(false);
    }
  };

  const price = useMemo(() => getPrice(quantity), [quantity, getPrice]);

  return (
    <div>
      <div className="quantity-container">
        <button onClick={handleDecrement}>-</button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className="quantity-input"
        />
        <button onClick={handleIncrement}>+</button>
      </div>
      <button onClick={handleTransaction} disabled={isProcessing}>
        {isProcessing ? "Processing..." : `${buttonText} (${price} BNB)`}
      </button>
    </div>
  );
};

export default NFTQuantityTransaction;