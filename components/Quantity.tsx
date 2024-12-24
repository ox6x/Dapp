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
    <div className={`${styles.quantityContainer} ${className}`}>
      <button className={styles.decrementButton} onClick={handleDecrement}>
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className={styles.quantityInput}
      />
      <button className={styles.incrementButton} onClick={handleIncrement}>
        +
      </button>
      <button className={styles.confirmButton} onClick={() => onQuantityChange(quantity)}>
        {buttonText}
      </button>
    </div>
  );
};

export default Quantity;