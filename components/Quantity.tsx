import React, { useState } from "react";

interface QuantityProps {
  onQuantityChange: (quantity: number) => void; // 回调函数，处理数量变化
  minQuantity?: number; // 最小数量，默认为 1
  buttonText?: string; // 按钮文本，默认为 "Confirm"
}

const Quantity: React.FC<QuantityProps> = ({
  onQuantityChange,
  minQuantity = 1,
  buttonText = "Confirm",
}) => {
  const [quantity, setQuantity] = useState<number>(minQuantity);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(minQuantity, quantity - 1);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= minQuantity) {
      setQuantity(value);
      onQuantityChange(value);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* 數量框與按鈕 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={handleDecrement}
          style={{
            padding: "6px 12px",
            background: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "4px 0 0 4px",
            cursor: "pointer",
          }}
        >
          {"<"}
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          style={{
            width: "50px",
            textAlign: "center",
            padding: "4px",
            borderRadius: "0",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleIncrement}
          style={{
            padding: "6px 12px",
            background: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: "pointer",
          }}
        >
          {">"}
        </button>
      </div>
      {/* 確認按鈕 */}
      <button
        onClick={() => onQuantityChange(quantity)}
        style={{
          padding: "6px 12px",
          background: "#38a169",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Quantity;