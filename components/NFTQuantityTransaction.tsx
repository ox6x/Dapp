import React, { useState } from "react";

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
  buttonText = "Claim NFT", // 默认按钮文本
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(Math.max(minQuantity, quantity - 1));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? value : minQuantity);
  };

  const handleTransaction = async () => {
    await onTransaction(quantity); // 调用交易逻辑
    setQuantity(initialQuantity); // 重置数量
    if (onTransactionConfirmed) onTransactionConfirmed(); // 调用确认回调
  };

  return (
    <div>
      {/* 数量选择器 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <button onClick={handleDecrement}>-</button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          style={{ width: "50px", textAlign: "center", margin: "0 10px" }}
        />
        <button onClick={handleIncrement}>+</button>
      </div>

      {/* 交易按钮 */}
      <button onClick={handleTransaction}>
        {`${buttonText} (${getPrice(quantity)} ETH)`}
      </button>
    </div>
  );
};

export default NFTQuantityTransaction;