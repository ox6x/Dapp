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
  // 確保傳入的初始值符合條件
  if (minQuantity < 1) {
    throw new Error("minQuantity must be at least 1");
  }

  if (initialQuantity < minQuantity) {
    throw new Error("initialQuantity cannot be less than minQuantity");
  }

  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 使用 useCallback 以確保穩定的引用，避免子組件不必要的重新渲染
  const handleIncrement = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  const handleDecrement = useCallback(() => {
    setQuantity((prev) => Math.max(minQuantity, prev - 1));
  }, [minQuantity]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= minQuantity) {
        setQuantity(value);
      } else {
        setQuantity(minQuantity);
      }
    },
    [minQuantity]
  );

  const handleTransaction = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await onTransaction(quantity);
      setQuantity(initialQuantity); // 重置數量到初始值
      onTransactionConfirmed?.(); // 可選回調
    } catch (error) {
      console.error("Transaction failed:", error); // 更好的錯誤處理
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, onTransaction, quantity, initialQuantity, onTransactionConfirmed]);

  // 使用 useMemo 優化計算避免不必要的重複執行
  const price = useMemo(() => getPrice(quantity), [quantity, getPrice]);

  return (
    <div>
      <div className="quantity-container">
        <button
          onClick={handleDecrement}
          disabled={isProcessing} // 禁用按鈕在處理過程中
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className="quantity-input"
          disabled={isProcessing} // 禁用輸入框在處理過程中
        />
        <button
          onClick={handleIncrement}
          disabled={isProcessing} // 禁用按鈕在處理過程中
        >
          +
        </button>
      </div>
      <button
        onClick={handleTransaction}
        disabled={isProcessing} // 顯示當前按鈕狀態
      >
        {isProcessing ? "Processing..." : `${buttonText} (${price} BNB)`}
      </button>
    </div>
  );
};

export default NFTQuantityTransaction;