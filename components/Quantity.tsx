import React, { useState } from "react";
import styles from "./Quantity.module.scss";

interface QuantityProps {
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
  buttonText?: string;
  className?: string; // 添加 className 属性
}

const Quantity: React.FC<QuantityProps> = ({
  onQuantityChange,
  minQuantity = 1,
  buttonText = "Confirm",
  className, // 接收 className 属性
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
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // 只允许数字输入
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        setQuantity(Math.max(minQuantity, numericValue));
        onQuantityChange(Math.max(minQuantity, numericValue));
      } else {
        setQuantity(minQuantity);
      }
    }
  };

  const handleInputBlur = () => {
    if (quantity < minQuantity) {
      setQuantity(minQuantity);
      onQuantityChange(minQuantity);
    }
  };

  return (
    <div className={`${styles.quantityContainer} ${className}`}>
      <button
        className={styles.decrementButton}
        onClick={handleDecrement}
        aria-label="Decrement"
      >
        -
      </button>
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={styles.quantityInput}
        aria-label="Quantity input"
      />
      <button
        className={styles.incrementButton}
        onClick={handleIncrement}
        aria-label="Increment"
      >
        +
      </button>
      <button
        className={styles.confirmButton}
        onClick={() => onQuantityChange(quantity)}
        aria-label="Confirm"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Quantity;