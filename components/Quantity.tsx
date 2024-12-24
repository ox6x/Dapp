import React, { useState } from "react";
import styles from "./Quantity.module.scss";

interface QuantityProps {
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
  buttonText?: string;
  className?: string; // 添加 className 屬性
}

const Quantity: React.FC<QuantityProps> = ({
  onQuantityChange,
  minQuantity = 1,
  buttonText = "Confirm",
  className, // 接收 className 屬性
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
    <div className={className} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        onClick={handleDecrement}
        style={{
          padding: "6px 12px",
          background: "#3182ce",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        style={{
          width: "50px",
          textAlign: "center",
          padding: "4px",
          borderRadius: "4px",
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
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        +
      </button>
      <button
        onClick={() => onQuantityChange(quantity)}
        style={{
          padding: "6px 12px",
          background: "#38a169",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Quantity;